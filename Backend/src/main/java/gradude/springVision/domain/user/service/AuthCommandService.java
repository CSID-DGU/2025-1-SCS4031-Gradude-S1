package gradude.springVision.domain.user.service;

import gradude.springVision.domain.user.dto.request.KakaoLoginRequestDTO;
import gradude.springVision.domain.user.dto.request.SignupRequestDTO;
import gradude.springVision.domain.user.dto.request.TokenRequestDTO;
import gradude.springVision.domain.user.dto.response.LoginResponseDTO;
import gradude.springVision.domain.user.dto.response.TokenResponseDTO;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.auth.TokenProvider;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@Transactional
@RequiredArgsConstructor
@Service
public class AuthCommandService {

    private final UserRepository userRepository;
    private final TokenProvider tokenProvider;

    /**
     * 카카오 로그인
     * - 가입된 사용자 -> 토큰 발급
     * - 가입되지 않은 사용자 -> 회원가입 위한 데이터 반환
     */
    public LoginResponseDTO login(KakaoLoginRequestDTO kakaoLoginRequestDTO) {
        validateKakaoUser(kakaoLoginRequestDTO);

        Optional<User> user = userRepository.findByKakaoId(kakaoLoginRequestDTO.getKakaoId());

        if (user.isPresent()) {
            String accessToken = tokenProvider.createAccessToken(user.get().getId());
            String refreshToken = tokenProvider.createRefreshToken(user.get().getId());
            TokenResponseDTO tokenResponseDTO = TokenResponseDTO.of(accessToken, refreshToken);
            return LoginResponseDTO.of(tokenResponseDTO, false);
        }

        return LoginResponseDTO.of(null, true);
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

    /**
     * 카카오 user 검증
     */
    public void validateKakaoUser(KakaoLoginRequestDTO kakaoLoginRequestDTO) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + kakaoLoginRequestDTO.getAccessToken());
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response;
        try {
            response = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/user/access_token_info",
                    HttpMethod.GET,
                    entity,
                    String.class
            );
        } catch (Exception ex) {
            throw new GeneralException(ErrorCode.INVALID_KAKAO_ACCESS_TOKEN);
        }

        try {
            ObjectMapper objectMapper = new ObjectMapper();

            JsonNode root = objectMapper.readTree(response.getBody());
            long verifiedKakaoId = root.get("id").asLong();

            if (kakaoLoginRequestDTO.getKakaoId() != verifiedKakaoId) {
                throw new GeneralException(ErrorCode.INVALID_KAKAO_USER);
            }

        } catch (JsonProcessingException e) {
            throw new GeneralException(ErrorCode.JSON_PARSE_ERROR);
        }
    }
}
