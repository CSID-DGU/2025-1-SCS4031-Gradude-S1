package gradude.springVision.domain.diagnosis.controller;

import gradude.springVision.domain.diagnosis.dto.request.SelfDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.AiDiagnosisResposneDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.service.DiagnosisCommandService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Tag(name = "자가 진단 API", description = "자가 진단 관련 API")
@RequestMapping("/api/diagnosis")
@RestController
public class DiagnosisController {

    private final DiagnosisCommandService diagnosisCommandService;

    @Operation(summary = "안면 자가 진단")
    @PostMapping(value = "/face", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<Object> faceDiagnosis(@AuthenticationPrincipal Long userId, MultipartFile file) {
        return ApiResponse.onSuccess(diagnosisCommandService.faceDiagnosis(userId, file));
    }

    @Operation(summary = "음성 자가 진단")
    @PostMapping(value = "/speech", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<AiDiagnosisResposneDTO> speechDiagnosis(@AuthenticationPrincipal Long userId, MultipartFile file) {
        return ApiResponse.onSuccess(diagnosisCommandService.speechDiagnosis(userId, file));
    }

    @Operation(summary = "설문 자가 진단")
    @PostMapping(value = "/survey")
    public ApiResponse<DiagnosisResponseDTO> selfDiagnosis(@AuthenticationPrincipal Long userId, @RequestBody SelfDiagnosisRequestDTO selfDiagnosisRequestDTO) {
        return ApiResponse.onSuccess(diagnosisCommandService.selfDiagnosis(userId, selfDiagnosisRequestDTO));
    }
}
