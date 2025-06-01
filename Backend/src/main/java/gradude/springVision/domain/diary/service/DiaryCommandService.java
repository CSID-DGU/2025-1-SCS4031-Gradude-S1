package gradude.springVision.domain.diary.service;

import gradude.springVision.domain.diary.dto.request.DiaryRequestDTO;
import gradude.springVision.domain.diary.dto.response.DiaryResponseDTO;
import gradude.springVision.domain.diary.entity.*;
import gradude.springVision.domain.diary.repository.DiaryRepository;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Transactional
@RequiredArgsConstructor
@Service
public class DiaryCommandService {

    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    /**
     * 하루 기록 생성
     */
    public DiaryResponseDTO createDiary(Long userId, DiaryRequestDTO diaryRequestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));

        // 하루 기록 이미 있는지 확인
        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.atTime(LocalTime.MAX);
        if (diaryRepository.existsByUserIdAndCreatedAtBetween(userId, startOfDay, endOfDay)) {
            throw new GeneralException(ErrorCode.DIARY_ALREADY_EXISTS);
        }

        // 건강 점수 계산
        int healthScore = calculateHealthScore(diaryRequestDTO);

        Diary diary = diaryRequestDTO.toEntity(user, diaryRequestDTO, healthScore);
        Diary savedDiary = diaryRepository.save(diary);

        return DiaryResponseDTO.from(savedDiary);
    }

    public int calculateHealthScore(DiaryRequestDTO diaryRequestDTO) {
        int drinkingScore = Drinking.ofOption(diaryRequestDTO.getDrinking()).getScoreImpact();
        int smokingScore = Smoking.ofOption(diaryRequestDTO.getSmoking()).getScoreImpact();
        int exerciseScore = Exercise.ofOption(diaryRequestDTO.getExercise()).getScoreImpact();
        int dietScore = Diet.ofOption(diaryRequestDTO.getDiet()).getScoreImpact();
        int sleepScore = Sleep.ofOption(diaryRequestDTO.getSleep()).getScoreImpact();

        int totalScore = drinkingScore + smokingScore + exerciseScore + dietScore + sleepScore;

        return Math.max(0, 100 + totalScore);
    }
}
