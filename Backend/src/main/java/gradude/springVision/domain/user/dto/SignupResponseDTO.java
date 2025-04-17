package gradude.springVision.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class SignupResponseDTO {

    private String accessToken;

    public static SignupResponseDTO of(String accessToken) {
        return SignupResponseDTO.builder()
                .accessToken(accessToken)
                .build();
    }
}
