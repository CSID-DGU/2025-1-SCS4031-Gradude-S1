package gradude.springVision.domain.diagnosis.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AiDiagnosisResposneDTO {

    private boolean prediction;
    private double probality;

    public static AiDiagnosisResposneDTO of(boolean prediction, double probality) {
        return AiDiagnosisResposneDTO.builder()
                .prediction(prediction)
                .probality(probality)
                .build();
    }
}
