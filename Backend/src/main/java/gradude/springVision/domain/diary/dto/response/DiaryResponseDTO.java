package gradude.springVision.domain.diary.dto.response;

import gradude.springVision.domain.diary.entity.Diary;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
public class DiaryResponseDTO {

    private Long diaryId;
    private LocalDate date;
    private int healthScore;
    private int drinking;
    private int smoking;
    private int exercise;
    private int diet;
    private int sleep;

    public static DiaryResponseDTO from(Diary diary) {
        return DiaryResponseDTO.builder()
                .diaryId(diary.getId())
                .date(diary.getCreatedAt().toLocalDate())
                .healthScore(diary.getHealthScore())
                .drinking(diary.getDrinking())
                .smoking(diary.getSmoking())
                .exercise(diary.getExercise())
                .diet(diary.getDiet())
                .sleep(diary.getSleep())
                .build();
    }
}
