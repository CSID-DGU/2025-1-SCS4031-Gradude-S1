package gradude.springVision.domain.diary.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Drinking {
    ONE_OR_LESS(1, 0),
    ONE_TO_THREE(2, -4),
    THREE_TO_SIX(3, -11),
    OVER_SIX(4, -19);

    private final int option;
    private final int scoreImpact;

    Drinking(int option, int scoreImpact) {
        this.option = option;
        this.scoreImpact = scoreImpact;
    }

    public static Drinking ofOption(int option) {
        return Arrays.stream(values())
                .filter(d -> d.option == option)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorCode.INVALID_DIARY_INPUT));
    }
}
