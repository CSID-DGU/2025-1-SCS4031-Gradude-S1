package gradude.springVision.domain.user.dto;

import gradude.springVision.domain.user.entity.Gender;
import gradude.springVision.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequestDTO {

    private Long kakaoId;
    private String nickname;
    private Gender gender;
    private LocalDate birth;
    private Boolean isFaceRecognitionAgreed;
    private String profileImageUrl;

    public User toEntity() {
        return User.builder()
                .kakaoId(this.kakaoId)
                .nickname(this.nickname)
                .gender(this.gender)
                .birth(this.birth)
                .isFaceRecognitionAgreed(this.isFaceRecognitionAgreed)
                .profileImageUrl(this.profileImageUrl)
                .build();
    }
}
