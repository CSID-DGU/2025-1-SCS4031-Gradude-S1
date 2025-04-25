package gradude.springVision.domain.diary.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class DiaryResponseDTO {

    private Long diaryId;

    public static DiaryResponseDTO of(Long diaryId) {
        return DiaryResponseDTO.builder()
                .diaryId(diaryId)
                .build();
    }
}
