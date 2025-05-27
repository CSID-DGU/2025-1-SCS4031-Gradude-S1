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
    private int exercise;
    private int smoking;
    private int snack;
    private int vegetable;

    public static DiaryResponseDTO from(Diary diary) {
        return DiaryResponseDTO.builder()
                .diaryId(diary.getId())
                .date(diary.getCreatedAt().toLocalDate())
                .healthScore(diary.getHealthScore())
                .drinking(diary.getDrinking())
                .exercise(diary.getExercise())
                .smoking(diary.getSmoking())
                .snack(diary.getSnack())
                .vegetable(diary.getVegetable())
                .build();
    }
}
