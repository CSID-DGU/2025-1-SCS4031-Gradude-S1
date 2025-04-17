package gradude.springVision.domain.user.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
public class KakaoUserInfoResponseDTO {

    private Long kakaoId;
    private String profileImageUrl;

    public static KakaoUserInfoResponseDTO of(Long kakaoId, String profileImageUrl) {
        return KakaoUserInfoResponseDTO.builder()
                .kakaoId(kakaoId)
                .profileImageUrl(profileImageUrl)
                .build();
    }
}
