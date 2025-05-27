package gradude.springVision.domain.user.service;

import gradude.springVision.domain.user.dto.response.UserResponseDTO;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserQueryService {

    private final UserRepository userRepository;

    /**
     * 프로필 조회
     */
    public UserResponseDTO getUserInfo(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new GeneralException(ErrorCode.USER_NOT_FOUND));

        return UserResponseDTO.from(user);
    }
}
