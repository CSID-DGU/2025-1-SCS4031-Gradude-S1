package gradude.springVision.domain.diary.service;

import gradude.springVision.domain.diary.dto.DiaryCalendarResponseDTO;
import gradude.springVision.domain.diary.dto.DiaryDetailResponseDTO;
import gradude.springVision.domain.diary.dto.DiaryGraphResponseDTO;
import gradude.springVision.domain.diary.entity.Diary;
import gradude.springVision.domain.diary.repository.DiaryRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@RequiredArgsConstructor
@Service
public class DiaryQueryService {

    private final DiaryRepository diaryRepository;

    /**
     * 하루 기록 조회
     */
    public DiaryDetailResponseDTO getDiary(Long userId, Long diaryId) {
        Diary diary = diaryRepository.findById(diaryId)
                .orElseThrow(() -> new GeneralException(ErrorCode.DIARY_NOT_FOUND));

        if (!diary.getUser().getId().equals(userId)) {
            throw new GeneralException(ErrorCode.DIARY_ACCESS_DENIED);
        }

        return DiaryDetailResponseDTO.from(diary);
    }

    /**
     * 하루 기록 캘린더 조회
     */
    public List<DiaryCalendarResponseDTO> getDiaryCalendar(Long userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);

        LocalDateTime startOfDay = yearMonth.atDay(1).atStartOfDay();
        LocalDateTime endOfDay = yearMonth.atEndOfMonth().atTime(LocalTime.MAX);

        return diaryRepository.findAllByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay).stream()
                .map(DiaryCalendarResponseDTO::from)
                .toList();
    }

    /**
     * 건강 점수 그래프 조회
     */
    public List<DiaryGraphResponseDTO> getDiaryGraph(Long userId) {

        return diaryRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(DiaryGraphResponseDTO::from)
                .toList();
    }
}
