package gradude.springVision.domain.diagnosis.service;

import gradude.springVision.domain.diagnosis.repository.DiagnosisRepository;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.util.S3Service;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Transactional
@RequiredArgsConstructor
@Service
public class DiagnosisCommandService {

    private final DiagnosisRepository diagnosisRepository;
    private final UserRepository userRepository;
    private final S3Service s3Service;

    /**
     * 안면 자가 진단
//     */
//    public FaceDiagnosisResposneDTO faceDiagnosis(Long userId, MultipartFile file) {
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));
//
//        String videoUrl = s3Service.uploadFile(userId, file, "face");
//
//        // TODO: AI 안면 자가 진단 (영상 파일 전송 -> 진단 결과 받아오기)
////        FaceDiagnosisResposneDTO faceDiagnosisResposneDTO = requestToAIServer(videoUrl);
//
//        // 진단 결과 DB 저장
//        Diagnosis diagnosis = Diagnosis.builder()
//                .date(LocalDate.now())
//                .facialParalysis(result.getFacialParalysis())
//                .probability(result.getProbability())
//                .user(getCurrentUser()) // 또는 userRepository.findById() 등
//                .build();
//        diagnosisRepository.save(diagnosis);
//
//        return result;
//
//    }

    public String faceDiagnosis(Long userId, MultipartFile file) {
            return s3Service.uploadFile(userId, file, "face");
    }
}
