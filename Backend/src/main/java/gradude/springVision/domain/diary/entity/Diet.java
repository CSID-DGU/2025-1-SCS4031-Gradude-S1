package gradude.springVision.domain.diary.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.Getter;

import java.util.Arrays;

@Getter
public enum Diet {
    HEALTHY(1, 0),
    PROCESSED_OR_HIGH_SALT(2, -7);

    private final int option;
    private final int scoreImpact;

    Diet(int option, int scoreImpact) {
        this.option = option;
        this.scoreImpact = scoreImpact;
    }

    public static Diet ofOption(int option) {
        return Arrays.stream(values())
                .filter(d -> d.option == option)
                .findFirst()
                .orElseThrow(() -> new GeneralException(ErrorCode.INVALID_DIARY_INPUT));
        }
}
