package gradude.springVision.domain.diagnosis.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class AiDiagnosisResponseDTO {

    private boolean facePrediction;
    private double faceProbality;
    private boolean speechPrediction;
    private double speechProbality;

    public static AiDiagnosisResponseDTO of(boolean facePrediction, double faceProbality, boolean speechPrediction, double speechProbality) {
        return AiDiagnosisResponseDTO.builder()
                .facePrediction(facePrediction)
                .faceProbality(faceProbality)
                .speechPrediction(speechPrediction)
                .speechProbality(speechProbality)
                .build();
    }
}
