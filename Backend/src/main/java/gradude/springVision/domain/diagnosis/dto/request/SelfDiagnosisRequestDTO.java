package gradude.springVision.domain.diagnosis.dto.request;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class SelfDiagnosisRequestDTO {

    private int orientationMonth;
    private int orientationAge;
    private int gaze;
    private int arm;
}
