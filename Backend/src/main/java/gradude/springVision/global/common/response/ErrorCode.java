package gradude.springVision.global.common.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {

    // General Error
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON500", "서버 에러, 관리자에게 문의 바랍니다."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST,"COMMON400","잘못된 요청입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED,"COMMON401","인증이 필요합니다."),
    FORBIDDEN(HttpStatus.FORBIDDEN, "COMMON403", "금지된 요청입니다."),
    FILE_SIZE_EXCEEDED(HttpStatus.PAYLOAD_TOO_LARGE, "COMMON413", "파일 최대 크기를 초과하였습니다."),
    JSON_PARSE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON501", "JSON 파싱 오류입니다"),
    FILE_UPLOAD_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "COMMON502", "파일 업로드에 실패했습니다."),

    // Unauthorized Error
    INVALID_TOKEN_SIGNATURE(HttpStatus.UNAUTHORIZED, "TOKEN401", "유효하지 않은 토큰 서명입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "TOKEN402", "만료된 토큰입니다."),
    UNSUPPORTED_TOKEN(HttpStatus.UNAUTHORIZED, "TOKEN403", "지원되지 않는 형식의 토큰입니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "TOKEN404", "토큰 형식이 잘못되었습니다."),

    // User Error
    USER_ALREADY_EXIST(HttpStatus.CONFLICT, "USER4000", "사용자가 이미 존재합니다."),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER4001", "사용자를 찾을 수 업습니다."),

    // Diary Error
    DIARY_NOT_FOUND(HttpStatus.NOT_FOUND, "DIARY4000", "하루 기록을 찾을 수 없습니다."),
    DIARY_ACCESS_DENIED(HttpStatus.FORBIDDEN, "DIARY4001", "하루 기록에 대한 권한이 없습니다."),
    DIARY_ALREADY_EXISTS(HttpStatus.CONFLICT, "DIARY4002", "하루 기록에 이미 존재합니다."),

    // Hospital Error
    HOSPITAL_NOT_FOUND(HttpStatus.NOT_FOUND, "HOSPITAL4000", "병원을 찾을 수 없습니다."),
    HOSPITAL_INVALID_SEARCH(HttpStatus.NOT_FOUND, "HOSPITAL4001", "병원 검색어는 두 글자 이상이어야 합니다."),

    // AI Error
    AI_PREDICTION_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "AI500", "AI 모델 진단 실패입니다."),
    AI_CALL_FAILED(HttpStatus.INTERNAL_SERVER_ERROR, "AI501", "AI 모델 호출 실패입니다."),

    // Diagnosis Error
    DIAGNOSIS_NOT_FOUND(HttpStatus.NOT_FOUND, "Diagnosis4000", "자가진단 결과를 찾을 수 없습니다.");

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;

    public ErrorReasonDTO getReason() {
        return ErrorReasonDTO.builder()
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }

    public ErrorReasonDTO getReasonHttpStatus() {
        return ErrorReasonDTO.builder()
                .httpStatus(httpStatus)
                .isSuccess(false)
                .code(code)
                .message(message)
                .build();
    }
}
