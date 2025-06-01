package gradude.springVision.domain.diary.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Exercise {
    OVER_150(1, 0),
    SIXTY_TO_ONE_FORTY_NINE(2, -4),
    UNDER_SIXTY(3, -9);

    private final int option;
    private final int scoreImpact;

    Exercise(int option, int scoreImpact) {
        this.option = option;
        this.scoreImpact = scoreImpact;
    }

    public static Exercise ofOption(int option) {
        return Arrays.stream(values())
                .filter(e -> e.option == option)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorCode.INVALID_DIARY_INPUT));
    }
}
