package gradude.springVision.domain.user.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class KakaoUserInfoResponseDTO {

    private String nickname;
    private String imageUrl;

    public static KakaoUserInfoResponseDTO of(String nickname, String imageUrl) {
        return KakaoUserInfoResponseDTO.builder()
                .nickname(nickname)
                .imageUrl(imageUrl)
                .build();
    }
}
