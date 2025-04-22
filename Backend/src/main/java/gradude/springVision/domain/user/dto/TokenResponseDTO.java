package gradude.springVision.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class TokenResponseDTO {

    private String accessToken;
    private String refreshToken;

    public static TokenResponseDTO of(String accessToken, String refreshToken) {
        return TokenResponseDTO.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
}
