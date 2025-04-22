package gradude.springVision.domain.user.service;

import gradude.springVision.domain.user.dto.*;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.auth.TokenProvider;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class AuthCommandService {

    private final UserRepository userRepository;
    private final OAuthCommandService oauthCommandService;
    private final TokenProvider tokenProvider;

    /**
     * 카카오 로그인
     * - 가입된 사용자 -> 토큰 발급
     * - 가입되지 않은 사용자 -> 회원가입 위한 데이터 반환
     */
    public LoginResponseDTO login(String code) {
        String kakaoAccessToken = oauthCommandService.getKakaoAccessToken(code);
        KakaoUserInfoResponseDTO kakaoUserInfoResponseDTO = oauthCommandService.getKakaoUserInfo(kakaoAccessToken);

        Optional<User> user = userRepository.findByKakaoId(kakaoUserInfoResponseDTO.getKakaoId());

        if (user.isPresent()) {
            String accessToken = tokenProvider.createAccessToken(user.get().getId());
            String refreshToken = tokenProvider.createRefreshToken(user.get().getId());
            TokenResponseDTO tokenResponseDTO = TokenResponseDTO.of(accessToken, refreshToken);
            return LoginResponseDTO.of(tokenResponseDTO, false);
        }

        return LoginResponseDTO.of(kakaoUserInfoResponseDTO, true);
    }

    /**
     * 회원가입
     * - 회원가입 사용자 정보 저장 및 토큰 발급
     */
    public TokenResponseDTO signup(SignupRequestDTO signupRequestDTO) {
        if (userRepository.existsByKakaoId(signupRequestDTO.getKakaoId())) {
            throw new GeneralException(ErrorCode.USER_ALREADY_EXIST);
        }

        User user = signupRequestDTO.toEntity();
        userRepository.save(user);

        String accessToken = tokenProvider.createAccessToken(user.getId());
        String refreshToken = tokenProvider.createRefreshToken(user.getId());

        return TokenResponseDTO.of(accessToken, refreshToken);
    }

    /**
     * 토큰 재발급
    */
    public TokenResponseDTO reissue(TokenRequestDTO tokenRequestDTO) {
        return tokenProvider.reissueToken(tokenRequestDTO);
    }
}
