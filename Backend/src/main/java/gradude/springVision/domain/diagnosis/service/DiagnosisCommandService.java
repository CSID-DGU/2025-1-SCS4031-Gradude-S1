package gradude.springVision.domain.diagnosis.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gradude.springVision.domain.diagnosis.dto.request.SelfDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.AiDiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.diagnosis.repository.DiagnosisRepository;
import gradude.springVision.domain.hospital.dto.response.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.response.HospitalSearchResponseDTO;
import gradude.springVision.domain.hospital.entity.Hospital;
import gradude.springVision.domain.hospital.repository.HospitalRepository;
import gradude.springVision.domain.hospital.service.HospitalQueryService;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import gradude.springVision.global.util.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

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
    private final LlmDiagnosisService llmDiagnosisService;
    private final HospitalQueryService hospitalQueryService;
    private final HospitalRepository hospitalRepository;

    private static final String[] ALLOWED_VIDEO_EXTENSIONS = {"mp4", "mov"};
    private static final String[] ALLOWED_AUDIO_EXTENSIONS = {"wav", "pcm", "m4a"};

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

    /**
     * 자가진단 AI API 호출
     */
    private Map<String, Object> callAiApi(String apiUrl, MultipartFile file) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        try {
            body.add("file", new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            });
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 업로드 실패: " + e.getMessage());
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI 예측 실패: 응답 본문이 없습니다.");
            }

        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            String responseBody = ex.getResponseBodyAsString();
            String detail = extractDetailMessage(responseBody);
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "AI 서버 오류: " + detail);

        } catch (ResourceAccessException ex) {
            throw new ResponseStatusException(HttpStatus.GATEWAY_TIMEOUT, "AI 서버 접근 실패: " + ex.getMessage());

        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "예기치 못한 오류: " + ex.getMessage());
        }
    }

    private String extractDetailMessage(String json) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);

            if (root.has("detail")) {
                JsonNode detailNode = root.get("detail");

                // detail이 문자열이면 바로 리턴
                if (detailNode.isTextual()) {
                    return detailNode.asText();
                }

                // detail이 객체면 error 필드 우선
                if (detailNode.has("error")) {
                    return detailNode.get("error").asText();
                }

                // detail 전체를 문자열로 반환
                return detailNode.toString();
            }
        } catch (Exception e) {
            // 파싱 실패시 원본문자열 일부만 리턴
            return json.length() > 200 ? json.substring(0, 200) + "..." : json;
        }

        return "상세 메시지를 파싱할 수 없습니다.";
    }

    /**
     * 설문 자가진단 후 자가진단 최종 결과 반환
     */
    public DiagnosisResponseDTO selfDiagnosis(Long userId, SelfDiagnosisRequestDTO selfDiagnosisRequestDTO) {
        Diagnosis diagnosis = diagnosisRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.DIAGNOSIS_NOT_FOUND));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));

        LocalDate today = LocalDate.now(ZoneId.of("Asia/Seoul")); // 오늘 날짜 ex) 2025-05-31

        // 만나이 계산
        LocalDate birth = user.getBirth();
        int age = today.getYear() - birth.getYear();
        if (today.getMonthValue() < birth.getMonthValue() ||
                (today.getMonthValue() == birth.getMonthValue() && today.getDayOfMonth() < birth.getDayOfMonth())) {
            // 생일이 아직 안 지났으면 한 살 빼기
            age--;
        }

        // 입력한 월(입력값 == 오늘 월), 만 나이 확인
        boolean isMonthCorrect = selfDiagnosisRequestDTO.getOrientationMonth() == today.getMonthValue();
        boolean isAgeCorrect = selfDiagnosisRequestDTO.getOrientationAge() == age;

        // 둘 다 틀렸을 경우만 orientation 이상
        int orientation = (!isMonthCorrect && !isAgeCorrect) ? 1 : 0;

        int totalScore = orientation + selfDiagnosisRequestDTO.getGaze() + selfDiagnosisRequestDTO.getArm()
                        + (diagnosis.isFace() ? 1 : 0) + (diagnosis.isSpeech() ? 1 : 0);

        // 증상 문장 생성
        String symptoms = String.format(
                "환자는 시선 이상 %s, 팔 움직임 이상 %s, 안면 마비 %s, 구음 장애 %s, 시간 인지 이상 %s, 나이 인지 이상 %s",
                selfDiagnosisRequestDTO.getGaze() == 1 ? "있음" : "없음",
                selfDiagnosisRequestDTO.getArm() == 1 ? "있음" : "없음",
                diagnosis.isFace() ? "있음" : "없음",
                diagnosis.isSpeech() ? "있음" : "없음",
                isMonthCorrect ? "없음" : "있음",
                isAgeCorrect ? "없음" : "있음"
        );

        // LLM 진단 결과
        String llmResult = llmDiagnosisService.analyzeSymptoms(symptoms).getResult();

        diagnosis.updateDiagnosis(selfDiagnosisRequestDTO, orientation, totalScore, llmResult);

        // 가까운 병원 2개 조회 (지도에서 모달 조회랑 같은 반환값들)
//        List<HospitalSearchResponseDTO> nearestHospitals = hospitalQueryService.getNearestHospitals(latitude, longitude)
//                .subList(0, Math.min(2, hospitalQueryService.getNearestHospitals(latitude, longitude).size()));
//
//        List<HospitalDetailResponseDTO> hospitalDetails = nearestHospitals.stream()
//                .map(dto -> {
//                    Hospital hospital = hospitalRepository.findById(dto.getHospitalId())
//                            .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));
//                    boolean isOpen = hospital.isEmergency()
//                            || (hospital.getOpeningHour() != null && hospital.isOpenNow());
//                    return HospitalDetailResponseDTO.ofMarker(hospital, dto.getDistance(), isOpen);
//                })
//                .toList();
        List<Long> hospitalIds = List.of(241L, 671L);

        List<HospitalDetailResponseDTO> hospitalDetails = hospitalIds.stream()
                .map(hospitalId -> {
                    Hospital hospital = hospitalRepository.findById(hospitalId)
                            .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

                    boolean isOpen = hospital.isEmergency()
                            || (hospital.getOpeningHour() != null && hospital.isOpenNow());

                    double distance = switch (hospitalId.intValue()) {
                        case 241 -> 0.8;
                        case 671 -> 1.2;
                        default -> 0.0; // 예외 처리용 기본값
                    };

                    return HospitalDetailResponseDTO.ofMarker(hospital, distance, isOpen);
                })
                .toList();
        return DiagnosisResponseDTO.from(diagnosis, llmResult, hospitalDetails);
    }
}



