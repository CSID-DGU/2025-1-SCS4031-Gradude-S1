package gradude.springVision.domain.diary.service;

import gradude.springVision.domain.diary.dto.DiaryDetailResponseDTO;
import gradude.springVision.domain.diary.entity.Diary;
import gradude.springVision.domain.diary.repository.DiaryRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
