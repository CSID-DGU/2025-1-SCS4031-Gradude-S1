package gradude.springVision.domain.diary.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Smoking {
    NON_SMOKER(1, 0),
    ONE_TO_FOURTEEN(2, -22),
    FIFTEEN_TO_TWENTY_FOUR(3, -41),
    OVER_TWENTY_FOUR(4, -54);

    private final int option;
    private final int scoreImpact;

    Smoking(int option, int scoreImpact) {
        this.option = option;
        this.scoreImpact = scoreImpact;
    }

    public static Smoking ofOption(int option) {
        return Arrays.stream(values())
                .filter(s -> s.option == option)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorCode.INVALID_DIARY_INPUT));
    }
}
