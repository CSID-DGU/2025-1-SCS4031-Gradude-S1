package gradude.springVision.global.common.response.exception;

import gradude.springVision.global.common.response.ApiResponse;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.ErrorReasonDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice(annotations = {RestController.class})
public class ExceptionAdvice extends ResponseEntityExceptionHandler {

    /**
     * @Valid 파라미터 검증 실패 시 발생하는 예외 처리
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException e,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        log.error(">>> @Valid 파라미터 검증 실패", e);
        return handleExceptionInternalFalse(e, ErrorCode.BAD_REQUEST, headers, HttpStatus.BAD_REQUEST, request, "유효하지 않은 요청 값입니다.");
    }

    /**
     * @RequestParam, @PathVariable 등의 유효성 검증 실패 시 발생하는 예외 처리
     */
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException e, WebRequest request) {
        log.error(">>> ConstraintViolationException 발생", e);
        return handleExceptionInternalFalse(e, ErrorCode.BAD_REQUEST, HttpHeaders.EMPTY, HttpStatus.BAD_REQUEST, request, "요청 값이 잘못되었습니다.");
    }

    /**
     * @RequestParam 타입이 잘못 들어온 경우 예외 처리
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException e, WebRequest request) {
        log.error(">>> 파라미터 타입 불일치", e);
        return handleExceptionInternalFalse(e, ErrorCode.BAD_REQUEST, HttpHeaders.EMPTY, HttpStatus.BAD_REQUEST, request, "파라미터의 타입이 잘못되었습니다.");
    }

    /**
     * @RequestParam 필수 파라미터 누락 시 예외 처리
     */
    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(MissingServletRequestParameterException e,
                                                                          HttpHeaders headers,
                                                                          HttpStatusCode status,
                                                                          WebRequest request) {
        log.error(">>> 필수 요청 파라미터 누락", e);
        return handleExceptionInternalFalse(e, ErrorCode.BAD_REQUEST, headers, HttpStatus.BAD_REQUEST, request, "필수 파라미터가 누락되었습니다.");
    }

    /**
     * 잘못된 형식의 JSON 요청으로 인한 JSON 파싱 실패 예외 처리
     */
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException e,
                                                                  HttpHeaders headers,
                                                                  HttpStatusCode status,
                                                                  WebRequest request) {
        log.error(">>> 요청 본문 읽기 실패 (JSON 파싱 오류)", e);
        return handleExceptionInternalFalse(e, ErrorCode.BAD_REQUEST, headers, HttpStatus.BAD_REQUEST, request, "요청 본문이 잘못되었거나 누락되었습니다.");
    }

    /**
     * 지원하지 않는 HTTP Method 요청 시 예외 처리
     */
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(HttpRequestMethodNotSupportedException ex,
                                                                         HttpHeaders headers,
                                                                         HttpStatusCode status,
                                                                         WebRequest request) {
        log.error(">>> 지원하지 않는 HTTP Method", ex);
        return handleExceptionInternalFalse(ex, ErrorCode.BAD_REQUEST, headers, HttpStatus.BAD_REQUEST, request, "지원하지 않는 HTTP 메서드입니다.");
    }

    /**
     * GeneralException 예외 처리 (비즈니스 로직 커스텀 예외 처리)
     */
    @ExceptionHandler(GeneralException.class)
    protected ResponseEntity<Object> handleGeneralException(GeneralException e,
                                                          HttpServletRequest request) {
        log.error(">>> General 예외 발생", e);
        ErrorReasonDTO reason = e.getErrorReasonHttpStatus();
        return handleExceptionInternal(e, reason, null, request);
    }

    /**
     * 처리되지 않은 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleUnhandledException(Exception e, WebRequest request) {
        log.error(">>> 처리되지 않은 예외 발생", e);
        return handleExceptionInternalFalse(e, ErrorCode.INTERNAL_SERVER_ERROR, HttpHeaders.EMPTY, HttpStatus.INTERNAL_SERVER_ERROR, request, e.getMessage());
    }

    // ================== 공통 응답 생성 메서드 ==================
    // 예외 처리 응답 생성을 위한 메서드
    // ErrorCode 및 ErrorReasonDTO 기반으로 ResponseEntity(표준 API 응답) 생성

    private ResponseEntity<Object> handleExceptionInternal(Exception e,
                                                           ErrorReasonDTO reason,
                                                           HttpHeaders headers,
                                                           HttpServletRequest request) {
        ApiResponse<Object> body = ApiResponse.onFailure(reason.getCode(), reason.getMessage(), null);
        WebRequest webRequest = new ServletWebRequest(request);
        return super.handleExceptionInternal(e, body, headers, reason.getHttpStatus(), webRequest);
    }

    private ResponseEntity<Object> handleExceptionInternalFalse(Exception e,
                                                                ErrorCode errorCode,
                                                                HttpHeaders headers,
                                                                HttpStatus status,
                                                                WebRequest request,
                                                                String detail) {
        ApiResponse<Object> body = ApiResponse.onFailure(errorCode.getCode(), errorCode.getMessage(), detail);
        return super.handleExceptionInternal(e, body, headers, status, request);
    }
}
