package gradude.springVision.domain.diagnosis.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LlmDiagnosisResponseDTO {
    private String result;
}
