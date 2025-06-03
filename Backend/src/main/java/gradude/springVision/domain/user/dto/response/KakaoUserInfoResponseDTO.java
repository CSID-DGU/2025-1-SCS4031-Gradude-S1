package gradude.springVision.domain.user.dto.response;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class KakaoUserInfoResponseDTO {

    private Long kakaoId;
    private String nickname;
    private String profileImageUrl;

    public static KakaoUserInfoResponseDTO of(Long kakaoId, String nickname, String profileImageUrl) {
        return KakaoUserInfoResponseDTO.builder()
                .kakaoId(kakaoId)
                .nickname(nickname)
                .profileImageUrl(profileImageUrl)
                .build();
    }
}
