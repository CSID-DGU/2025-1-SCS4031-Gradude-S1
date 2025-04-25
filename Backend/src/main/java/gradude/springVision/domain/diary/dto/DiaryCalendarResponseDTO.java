package gradude.springVision.domain.diary.dto;

import gradude.springVision.domain.diary.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
@AllArgsConstructor
public class DiaryCalendarResponseDTO {

    private LocalDate date;
    private Long diaryId;

    public static DiaryCalendarResponseDTO from(Diary diary) {
        return DiaryCalendarResponseDTO.builder()
                .date(diary.getCreatedAt().toLocalDate())
                .diaryId(diary.getId())
                .build();
    }
}
