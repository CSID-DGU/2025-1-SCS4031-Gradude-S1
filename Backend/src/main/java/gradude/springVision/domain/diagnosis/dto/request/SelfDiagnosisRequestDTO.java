package gradude.springVision.domain.diagnosis.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SelfDiagnosisRequestDTO {

    private int alertness;
    private int orientationMonth;
    private int orientationAge;
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
}
