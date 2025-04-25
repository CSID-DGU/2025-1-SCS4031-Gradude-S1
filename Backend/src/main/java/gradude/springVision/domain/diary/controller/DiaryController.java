package gradude.springVision.domain.diary.controller;

import gradude.springVision.domain.diary.dto.request.DiaryRequestDTO;
import gradude.springVision.domain.diary.dto.response.DiaryCalendarResponseDTO;
import gradude.springVision.domain.diary.dto.response.DiaryDetailResponseDTO;
import gradude.springVision.domain.diary.dto.response.DiaryGraphResponseDTO;
import gradude.springVision.domain.diary.dto.response.DiaryResponseDTO;
import gradude.springVision.domain.diary.service.DiaryCommandService;
import gradude.springVision.domain.diary.service.DiaryQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RequiredArgsConstructor
@Tag(name = "건강 수첩 API", description = "건강 수첩 관련 API")
@RequestMapping("/api/health-diary")
@RestController
public class DiaryController {

    private final DiaryCommandService diaryCommandService;
    private final DiaryQueryService diaryQueryService;

    @Operation(summary = "하루 기록 생성", description = "오늘의 하루 기록을 생성")
    @PostMapping()
    public ApiResponse<DiaryResponseDTO> createDiary(@AuthenticationPrincipal Long userId, @RequestBody DiaryRequestDTO diaryRequestDTO) {
        return ApiResponse.onSuccess(diaryCommandService.createDiary(userId, diaryRequestDTO));
    }

    @Operation(summary = "하루 기록 조회")
    @Parameter(name = "diaryId", description = "하루 기록 생성 및 캘린더 조회에서 받은 diaryId")
    @PostMapping("/{diaryId}")
    public ApiResponse<DiaryDetailResponseDTO> getDiary(@AuthenticationPrincipal Long userId, @PathVariable("diaryId") Long diaryId) {
        return ApiResponse.onSuccess(diaryQueryService.getDiary(userId, diaryId));
    }

    @Operation(summary = "하루 기록 캘린더 조회", description = "년/월 기준으로 하루 기록이 작성된 날짜와 해당 기록의 id 조회")
    @PostMapping("/calendar")
    public ApiResponse<List<DiaryCalendarResponseDTO>> getDiaryCalender(@AuthenticationPrincipal Long userId,
                                                                        @RequestParam int year, @RequestParam int month) {
        return ApiResponse.onSuccess(diaryQueryService.getDiaryCalendar(userId, year, month));
    }

    @Operation(summary = "건강 점수 그래프 조회", description = "최근 5개 하루 기록의 건강 점수 조회")
    @PostMapping("/graph")
    public ApiResponse<List<DiaryGraphResponseDTO>> getDiaryGraph(@AuthenticationPrincipal Long userId) {
        return ApiResponse.onSuccess(diaryQueryService.getDiaryGraph(userId));
    }
}
