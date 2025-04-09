package gradude.springVision.global.common.response.exception;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.ErrorReasonDTO;
import lombok.Getter;

@Getter
public class GeneralException extends RuntimeException {

    private final ErrorCode errorCode;

    public GeneralException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }

    public ErrorReasonDTO getErrorReason() {
        return this.errorCode.getReason();
    }

    public ErrorReasonDTO getErrorReasonHttpStatus() {
        return this.errorCode.getReasonHttpStatus();
    }
}
