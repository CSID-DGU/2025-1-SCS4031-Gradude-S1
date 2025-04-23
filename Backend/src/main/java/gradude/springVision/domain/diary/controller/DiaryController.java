package gradude.springVision.domain.diary.controller;

import gradude.springVision.domain.diary.dto.DiaryDetailResponseDTO;
import gradude.springVision.domain.diary.dto.DiaryRequestDTO;
import gradude.springVision.domain.diary.dto.DiaryResponseDTO;
import gradude.springVision.domain.diary.service.DiaryCommandService;
import gradude.springVision.domain.diary.service.DiaryQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RequiredArgsConstructor
@Tag(name = "건강 수첩 API", description = "건강 수첩 관련 API")
@RequestMapping("/api/health-diary")
@RestController
public class DiaryController {

    private final DiaryCommandService diaryCommandService;
    private final DiaryQueryService diaryQueryService;

    @Operation(summary = "하루 기록 생성")
    @PostMapping()
    public ApiResponse<DiaryResponseDTO> createDiary(@AuthenticationPrincipal Long userId, @RequestBody DiaryRequestDTO diaryRequestDTO) {
        return ApiResponse.onSuccess(diaryCommandService.createDiary(userId, diaryRequestDTO));
    }

    @Operation(summary = "하루 기록 조회")
    @PostMapping("/{diaryId}")
        public ApiResponse<DiaryDetailResponseDTO> getDiary(@AuthenticationPrincipal Long userId, @PathVariable Long diaryId) {
            return ApiResponse.onSuccess(diaryQueryService.getDiary(userId, diaryId));
        }
}
