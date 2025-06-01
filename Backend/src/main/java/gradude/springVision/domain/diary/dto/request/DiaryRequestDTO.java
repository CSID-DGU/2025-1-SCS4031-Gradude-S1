package gradude.springVision.domain.diary.dto.request;

import gradude.springVision.domain.diary.entity.Diary;
import gradude.springVision.domain.user.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DiaryRequestDTO {

    private int drinking;
    private int smoking;
    private int exercise;
    private int diet;
    private int sleep;

    public Diary toEntity(User user, DiaryRequestDTO diaryRequestDTO, int healthScore) {
        return Diary.builder()
                .user(user)
                .drinking(diaryRequestDTO.getDrinking())
                .smoking(diaryRequestDTO.getSmoking())
                .exercise(diaryRequestDTO.getExercise())
                .diet(diaryRequestDTO.getDiet())
                .sleep(diaryRequestDTO.getSleep())
                .healthScore(healthScore)
                .build();
    }
}
