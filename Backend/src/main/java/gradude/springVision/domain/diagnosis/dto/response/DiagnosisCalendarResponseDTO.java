package gradude.springVision.domain.diagnosis.dto.response;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class DiagnosisCalendarResponseDTO {

    private LocalDate date;
    private Long diagnosisId;

    public static DiagnosisCalendarResponseDTO from(Diagnosis diagnosis) {
        return DiagnosisCalendarResponseDTO.builder()
                .date(diagnosis.getCreatedAt().toLocalDate())
                .diagnosisId(diagnosis.getId())
                .build();
    }
}
