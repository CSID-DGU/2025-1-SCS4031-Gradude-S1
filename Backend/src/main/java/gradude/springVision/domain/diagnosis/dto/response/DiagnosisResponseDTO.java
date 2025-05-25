package gradude.springVision.domain.diagnosis.dto.response;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DiagnosisResponseDTO {

    private boolean face;
    private boolean speech;
    private int alertness;
    private int orientation;
    private int gaze;
    private int visualField;
    private int leftArm;
    private int rightArm;
    private int leftLeg;
    private int rightLeg;
    private int limbAtaxia;
    private int sensory;
    private int aphasia;
    private int neglect;
    private int totalScore;

    public static DiagnosisResponseDTO from(Diagnosis diagnosis) {
        return DiagnosisResponseDTO.builder()
                .face(diagnosis.isFace())
                .speech(diagnosis.isSpeech())
                .alertness(diagnosis.getAlertness())
                .orientation(diagnosis.getOrientation())
                .gaze(diagnosis.getGaze())
                .visualField(diagnosis.getVisualField())
                .leftArm(diagnosis.getLeftArm())
                .rightArm(diagnosis.getRightArm())
                .leftLeg(diagnosis.getLeftLeg())
                .rightLeg(diagnosis.getRightLeg())
                .limbAtaxia(diagnosis.getLimbAtaxia())
                .sensory(diagnosis.getSensory())
                .aphasia(diagnosis.getAphasia())
                .neglect(diagnosis.getNeglect())
                .totalScore(diagnosis.getTotalScore())
                .build();
    }
}
