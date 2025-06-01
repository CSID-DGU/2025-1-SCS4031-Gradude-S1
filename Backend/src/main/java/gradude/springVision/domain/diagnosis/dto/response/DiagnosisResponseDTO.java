package gradude.springVision.domain.diagnosis.dto.response;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import lombok.Builder;
import lombok.Getter;

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

    public static DiagnosisResponseDTO from(Diagnosis diagnosis, String llmResult) {
        return DiagnosisResponseDTO.builder()
                .face(diagnosis.isFace())
                .speech(diagnosis.isSpeech())
                .orientation(diagnosis.getOrientation())
                .gaze(diagnosis.getGaze())
                .arm(diagnosis.getArm())
                .totalScore(diagnosis.getTotalScore())
                .totalScorePercentage(diagnosis.getTotalScore() * 20)
                .llmResult(llmResult)
                .build();
    }
}
