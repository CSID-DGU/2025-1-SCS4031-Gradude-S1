package gradude.springVision.domain.diary.dto;

import gradude.springVision.domain.diary.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Builder
@Getter
@AllArgsConstructor
public class DiaryGraphResponseDTO {

    private LocalDate date;
    private int healthScore;

    public static DiaryGraphResponseDTO from(Diary diary) {
        return DiaryGraphResponseDTO.builder()
                .date(diary.getCreatedAt().toLocalDate())
                .healthScore(diary.getHealthScore())
                .build();
    }
}
