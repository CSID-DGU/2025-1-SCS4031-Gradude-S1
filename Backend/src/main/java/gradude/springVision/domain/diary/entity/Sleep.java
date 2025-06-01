package gradude.springVision.domain.diary.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Sleep {
    SEVEN_TO_EIGHT(1, 0),
    UNDER_SIX(2, -8),
    OVER_NINE(3, -8);

    private final int option;
    private final int scoreImpact;

    Sleep(int option, int scoreImpact) {
        this.option = option;
        this.scoreImpact = scoreImpact;
    }

    public static Sleep ofOption(int option) {
        return Arrays.stream(values())
                .filter(s -> s.option == option)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorCode.INVALID_DIARY_INPUT));
    }
}
