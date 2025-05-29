package gradude.springVision.domain.diagnosis.service;

import gradude.springVision.domain.diagnosis.dto.request.SelfDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.AiDiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.diagnosis.repository.DiagnosisRepository;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import gradude.springVision.global.util.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.IOException;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Map;

@Transactional
@RequiredArgsConstructor

@Service
public class DiagnosisCommandService {

    @Value("${external.facial-api-url}")
    private String facialApiUrl;
    @Value("${external.speech-api-url}")
    private String speechApiUrl;
    private final UserRepository userRepository;
    private final DiagnosisRepository diagnosisRepository;
    private final S3Service s3Service;

    private static final String[] ALLOWED_VIDEO_EXTENSIONS = {"mp4"};
    private static final String[] ALLOWED_AUDIO_EXTENSIONS = {"wav", "pcm"};

    /**
     * 안면+음성 자가 진단
     */
    public AiDiagnosisResponseDTO aiDiagnosis(Long userId, MultipartFile mp4File, MultipartFile wavFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));

        // 파일 확장자 검사
        validateExtension(mp4File, ALLOWED_VIDEO_EXTENSIONS);
        validateExtension(wavFile, ALLOWED_AUDIO_EXTENSIONS);

        // s3에 저장
        s3Service.uploadFile(userId, mp4File, "video");
        s3Service.uploadFile(userId, wavFile, "audio");

        // 안면 자가진단
        Map<String, Object> faceResult = callAiApi(facialApiUrl, mp4File);
        boolean facePrediction = ((int) faceResult.get("prediction")) == 1;
        double faceProbability = (double) faceResult.get("probability");

        // 음성 자가진단
        Map<String, Object> speechResult = callAiApi(speechApiUrl, wavFile);
        boolean speechPrediction = ((int) speechResult.get("prediction")) == 1;
        double speechProbability = (double) speechResult.get("probability");

        // 진단 엔티티 생성 및 저장
        Diagnosis diagnosis = Diagnosis.builder()
                .user(user)
                .face(facePrediction)
                .faceProbability(faceProbability)
                .speech(speechPrediction)
                .speechProbability(speechProbability)
                .build();

        diagnosisRepository.save(diagnosis);

        return AiDiagnosisResponseDTO.of(facePrediction, faceProbability, speechPrediction, speechProbability);
    }

    /**
     * 파일 확장자 검사
     */
    private void validateExtension(MultipartFile file, String[] allowedExtensions) {
        String filename = file.getOriginalFilename();
        if (filename == null ||
                Arrays.stream(allowedExtensions)
                        .noneMatch(ext -> filename.toLowerCase().endsWith("." + ext))) {
            throw new GeneralException(ErrorCode.FILE_EXTENSION_NOT_SUPPORTED);
        }
    }

    // 자가진단 AI API 호출
    private Map<String, Object> callAiApi(String apiUrl, MultipartFile file) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>(); // Multipart/form-data
        try {
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });
        } catch (IOException e) {
            throw new GeneralException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new GeneralException(ErrorCode.AI_PREDICTION_FAILED);
            }
        } catch (Exception e) {
            throw new GeneralException(ErrorCode.AI_CALL_FAILED);
        }
    }

    /**
     * 설문 자가진단 후 자가진단 최종 결과 반환
     */
    public DiagnosisResponseDTO selfDiagnosis(Long userId, SelfDiagnosisRequestDTO selfDiagnosisRequestDTO) {
        Diagnosis diagnosis = diagnosisRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.DIAGNOSIS_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));

        int orientation = 0;

        LocalDate today = LocalDate.now(); // 오늘 날짜

        // 월 확인 (입력값 == 오늘 월)
        if (selfDiagnosisRequestDTO.getOrientationMonth() != today.getDayOfMonth()) {
            orientation += 1;
        }

        // 만나이 계산
        LocalDate birth = user.getBirth();
        int age = today.getYear() - birth.getYear();
        if (today.getMonthValue() < birth.getMonthValue() ||
                (today.getMonthValue() == birth.getMonthValue() && today.getDayOfMonth() < birth.getDayOfMonth())) {
            // 생일이 아직 안 지났으면 한 살 빼기
            age--;
        }

        // 입력한 만 나이와 비교
        if (selfDiagnosisRequestDTO.getOrientationAge() != age) {
            orientation += 1;
        }

        int totalScore = selfDiagnosisRequestDTO.getAlertness() + orientation + selfDiagnosisRequestDTO.getGaze()
                        + selfDiagnosisRequestDTO.getVisualField() + selfDiagnosisRequestDTO.getLeftArm() + selfDiagnosisRequestDTO.getRightArm()
                        + selfDiagnosisRequestDTO.getLeftLeg() + selfDiagnosisRequestDTO.getRightLeg() + selfDiagnosisRequestDTO.getLimbAtaxia()
                        + selfDiagnosisRequestDTO.getSensory() + selfDiagnosisRequestDTO.getAphasia() + selfDiagnosisRequestDTO.getNeglect()
                        + (diagnosis.isFace() ? 2 : 0) + (diagnosis.isSpeech() ? 2 : 0);

        diagnosis.updateDiagnosis(selfDiagnosisRequestDTO, orientation, totalScore);

        return DiagnosisResponseDTO.from(diagnosis);
    }
}
