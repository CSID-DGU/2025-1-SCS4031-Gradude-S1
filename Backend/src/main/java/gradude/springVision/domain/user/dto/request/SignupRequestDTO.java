package gradude.springVision.domain.user.dto.request;

import gradude.springVision.domain.user.entity.Gender;
import gradude.springVision.domain.user.entity.User;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
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

    @NotNull
    private Long kakaoId;

    @NotBlank
    private String nickname;

    @NotNull
    private Gender gender;

    @NotNull
    @Past
    private LocalDate birth;

    @NotNull
    @AssertTrue
    private boolean isFaceRecognitionAgreed;

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
