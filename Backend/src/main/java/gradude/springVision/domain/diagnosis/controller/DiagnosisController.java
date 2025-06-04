package gradude.springVision.domain.diagnosis.controller;

import gradude.springVision.domain.diagnosis.dto.request.SelfDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.AiDiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisCalendarResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.service.DiagnosisCommandService;
import gradude.springVision.domain.diagnosis.service.DiagnosisQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@Tag(name = "자가 진단 API", description = "자가 진단 관련 API")
@RequestMapping("/api/diagnosis")
@RestController
public class DiagnosisController {

    private final DiagnosisCommandService diagnosisCommandService;
    private final DiagnosisQueryService diagnosisQueryService;

    @Operation(summary = "AI 자가 진단")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ApiResponse<AiDiagnosisResponseDTO> combinedDiagnosis(@AuthenticationPrincipal Long userId,
                                                                 @RequestPart("faceFile") MultipartFile faceFile, @RequestPart("speechFile") MultipartFile speechFile) {
        return ApiResponse.onSuccess(diagnosisCommandService.aiDiagnosis(userId, faceFile, speechFile));
    }

    @Operation(summary = "설문 자가 진단", description = "gaze와 arm은 증상이 있으면 1, 없으면 0 으로 입력 받습니다.")
    @PostMapping(value = "/survey")
    public ApiResponse<DiagnosisResponseDTO> selfDiagnosis(@AuthenticationPrincipal Long userId, @RequestBody SelfDiagnosisRequestDTO selfDiagnosisRequestDTO
                                                           ){
        return ApiResponse.onSuccess(diagnosisCommandService.selfDiagnosis(userId, selfDiagnosisRequestDTO));
    }

    @Operation(summary = "자가진단 기록 있는 날 모아보기")
    @GetMapping("/list")
    public ApiResponse<List<DiagnosisCalendarResponseDTO>> getDiagnosisList(@AuthenticationPrincipal Long userId) {
        return ApiResponse.onSuccess(diagnosisQueryService.getDiagnosisCalendar(userId));
    }

    @Operation(summary = "저장된 자가진단지 조회")
    @GetMapping("/{diagnosisId}")
    public ApiResponse<DiagnosisResponseDTO> getDiagnosisDetail(@PathVariable Long diagnosisId) {
        return ApiResponse.onSuccess(diagnosisQueryService.getDiagnosisDetail(diagnosisId));
    }
}
