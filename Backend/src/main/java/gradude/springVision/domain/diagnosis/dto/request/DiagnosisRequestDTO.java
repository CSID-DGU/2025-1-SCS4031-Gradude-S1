package gradude.springVision.domain.diagnosis.dto.request;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DiagnosisRequestDTO {

    private int facialParalysis;

    public Diagnosis toEntity(User user) {
        return Diagnosis.builder()
                .face(this.facialParalysis)
                .user(user)
                .build();
    }
}
