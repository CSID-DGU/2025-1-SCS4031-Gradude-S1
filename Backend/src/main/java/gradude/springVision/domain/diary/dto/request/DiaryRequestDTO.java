package gradude.springVision.domain.diary.dto.request;

import gradude.springVision.domain.diary.entity.Diary;
import gradude.springVision.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryRequestDTO {

    private int drinking;
    private int exercise;
    private int smoking;
    private int snack;
    private int vegetable;

    public Diary toEntity(User user, DiaryRequestDTO diaryRequestDTO, int healthScore) {
        return Diary.builder()
                .user(user)
                .drinking(diaryRequestDTO.getDrinking())
                .exercise(diaryRequestDTO.getExercise())
                .smoking(diaryRequestDTO.getSmoking())
                .snack(diaryRequestDTO.getSnack())
                .vegetable(diaryRequestDTO.getVegetable())
                .healthScore(healthScore)
                .build();
    }
}
