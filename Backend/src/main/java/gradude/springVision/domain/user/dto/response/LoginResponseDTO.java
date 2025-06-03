package gradude.springVision.domain.user.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponseDTO {

    private boolean isFirstLogin;
    private TokenResponseDTO tokenResponse;

    public static LoginResponseDTO of(TokenResponseDTO tokenResponse, boolean isFirstLogin) {
        return LoginResponseDTO.builder()
                .isFirstLogin(isFirstLogin)
                .tokenResponse(tokenResponse)
                .build();
    }
}
