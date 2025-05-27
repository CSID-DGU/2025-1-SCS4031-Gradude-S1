package gradude.springVision.domain.user.dto.response;

import gradude.springVision.domain.user.entity.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserResponseDTO {

    private Long id;
    private String nickName;
    private String profileImageUrl;

    public static UserResponseDTO from(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .nickName(user.getNickname())
                .profileImageUrl(user.getProfileImageUrl())
                .build();
    }
}
