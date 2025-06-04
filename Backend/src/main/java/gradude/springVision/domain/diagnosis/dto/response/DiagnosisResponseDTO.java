package gradude.springVision.domain.diagnosis.dto.response;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.hospital.dto.response.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.response.HospitalSearchResponseDTO;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
@Getter
public class DiagnosisResponseDTO {

    private boolean face;
    private boolean speech;
    private int orientation;
    private int gaze;
    private int arm;
    private int totalScore;
    private int totalScorePercentage;
    private String llmResult;
    private List<HospitalDetailResponseDTO> hospitalList;

    public static DiagnosisResponseDTO from(Diagnosis diagnosis, String llmResult, List<HospitalDetailResponseDTO> hospitalList) {
        return DiagnosisResponseDTO.builder()
                .face(diagnosis.isFace())
                .speech(diagnosis.isSpeech())
                .orientation(diagnosis.getOrientation())
                .gaze(diagnosis.getGaze())
                .arm(diagnosis.getArm())
                .totalScore(diagnosis.getTotalScore())
                .totalScorePercentage(diagnosis.getTotalScore() * 20)
                .llmResult(llmResult)
                .hospitalList(hospitalList)
                .build();
    }
}
