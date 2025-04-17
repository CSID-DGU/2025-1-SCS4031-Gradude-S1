package gradude.springVision.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class LoginResponseDTO {
    private boolean isFirstLogin;
    private String accessToken;
    private KakaoUserInfoResponseDTO userInfo;

    public static LoginResponseDTO of(String accessToken, boolean isFirstLogin) {
        return LoginResponseDTO.builder()
                .isFirstLogin(isFirstLogin)
                .accessToken(accessToken)
                .userInfo(null)
                .build();
    }

    public static LoginResponseDTO of(KakaoUserInfoResponseDTO userInfo, boolean isFirstLogin) {
        return LoginResponseDTO.builder()
                .isFirstLogin(isFirstLogin)
                .accessToken(null)
                .userInfo(userInfo)
                .build();
    }
}
