package gradude.springVision.global.common.response.exception;

import gradude.springVision.global.common.response.ApiResponse;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.ErrorReasonDTO;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ConstraintViolation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestControllerAdvice(annotations = {RestController.class})
public class GlobalExceptionHandler {

    /**
     * @Valid 파라미터 검증 실패 시 발생하는 예외 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e) {
        log.error(">>> @Valid 파라미터 검증 실패", e);
        Map<String, String> errorMessages = e.getBindingResult().getFieldErrors().stream()
                .collect(Collectors.toMap(FieldError::getField, DefaultMessageSourceResolvable::getDefaultMessage));
        return handleExceptionInternal(e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, errorMessages);
    }

    /**
     * @RequestParam, @PathVariable 등의 유효성 검증 실패 시 발생하는 예외 처리
     */
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException e) {
        log.error(">>> ConstraintViolationException 발생", e);
        Map<String, String> errors = e.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> {
                            String path = violation.getPropertyPath().toString();
                            return path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
                        },
                        ConstraintViolation::getMessage,
                        (existing, replacement) -> existing
                ));
        return handleExceptionInternal(e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, errors);
    }

    /**
     * @RequestParam 타입이 잘못 들어온 경우 예외 처리
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e) {
        log.error(">>> 파라미터 타입 불일치", e);
        return handleExceptionInternal(e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, "파라미터의 타입이 잘못되었습니다.");
    }

    /**
     * @RequestParam 필수 파라미터 누락 시 예외 처리
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException e) {
        log.error(">>> 필수 요청 파라미터 누락", e);
        return handleExceptionInternal(e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, "필수 파라미터가 누락되었습니다.");
    }

    /**
     * 잘못된 형식의 JSON 요청으로 인한 JSON 파싱 실패 예외 처리
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e) {
        log.error(">>> 요청 본문 읽기 실패 (JSON 파싱 오류)", e);
        return handleExceptionInternal(e, ErrorCode.BAD_REQUEST, HttpStatus.BAD_REQUEST, "요청 본문 형식이 잘못되었거나 누락되었습니다.");
    }

    /**
     * GeneralException 예외 처리 (비즈니스 로직 커스텀 예외 처리)
     */
    @ExceptionHandler(GeneralException.class)
    protected ResponseEntity<Object> handleGeneralException(GeneralException e) {
        log.error(">>> General 예외 발생", e);
        ErrorReasonDTO reason = e.getErrorReasonHttpStatus();
        return handleExceptionInternal(reason);
    }

    /**
     * 처리되지 않은 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleUnhandledException(Exception e) {
        log.error(">>> 처리되지 않은 예외 발생", e);
        return handleExceptionInternal(e, ErrorCode.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
    }

    // ================== 공통 응답 생성 메서드 ==================

    private ResponseEntity<Object> handleExceptionInternal(ErrorReasonDTO reason) {
        ApiResponse<Object> body = ApiResponse.onFailure(reason.getCode(), reason.getMessage(), null);
        return ResponseEntity.status(reason.getHttpStatus()).body(body);
    }

    private ResponseEntity<Object> handleExceptionInternal(Exception e,
                                                           ErrorCode errorCode,
                                                           HttpStatus status,
                                                           Object detail) {
        ApiResponse<Object> body = ApiResponse.onFailure(errorCode.getCode(), errorCode.getMessage(), detail);
        return ResponseEntity.status(status).body(body);
    }
}
