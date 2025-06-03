package gradude.springVision.domain.user.service;

import gradude.springVision.domain.user.dto.request.KakaoLoginRequestDTO;
import gradude.springVision.domain.user.dto.request.SignupRequestDTO;
import gradude.springVision.domain.user.dto.request.TokenRequestDTO;
import gradude.springVision.domain.user.dto.response.KakaoUserInfoResponseDTO;
import gradude.springVision.domain.user.dto.response.LoginResponseDTO;
import gradude.springVision.domain.user.dto.response.TokenResponseDTO;
import gradude.springVision.domain.user.entity.User;
import gradude.springVision.domain.user.repository.UserRepository;
import gradude.springVision.global.auth.TokenProvider;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

import java.util.Optional;

@Slf4j
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
        System.out.println("================validate성공");

        Optional<User> user = userRepository.findByKakaoId(kakaoLoginRequestDTO.getKakaoId());
        System.out.println("-=============회원가입된 유저인지 검증 성공");
        KakaoUserInfoResponseDTO kakaoUserInfoResponseDTO = getKakaoUserInfo(kakaoLoginRequestDTO.getAccessToken());
        System.out.println("===========카카오에서 유저 정보 불러오기 성공");

        if (user.isPresent()) {
            String accessToken = tokenProvider.createAccessToken(user.get().getId());
            String refreshToken = tokenProvider.createRefreshToken(user.get().getId());
            TokenResponseDTO tokenResponseDTO = TokenResponseDTO.of(accessToken, refreshToken);
            return LoginResponseDTO.of(kakaoUserInfoResponseDTO, tokenResponseDTO, false);
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
        } catch (HttpClientErrorException e) {
            log.error("카카오 access_token_info 요청 실패. 응답: {}", e.getResponseBodyAsString());
            throw new GeneralException(ErrorCode.INVALID_KAKAO_ACCESS_TOKEN);
        } catch (Exception e) {
            log.error("카카오 access_token_info 요청 중 예외 발생", e);
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

    public KakaoUserInfoResponseDTO getKakaoUserInfo(String accessToken) {
        RestTemplate restTemplate = new RestTemplate(); // HTTP 통신 위해 RestTemplate 객체 생성

        // 요청 header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 최종 요청 객체 생성
        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);

        // 카카오 토큰 요청 API 호출
        ResponseEntity<String> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );

        try {
            // 응답 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            Long kakaoId = jsonNode.get("id").asLong();
            String nickname = jsonNode.get("properties").get("nickname").asText();
            String picture = jsonNode.get("properties").has("profile_image")? jsonNode.get("properties").get("profile_image").asText() : null;

            return KakaoUserInfoResponseDTO.of(kakaoId, nickname, picture);
        } catch (JsonProcessingException e) {
            throw new GeneralException(ErrorCode.JSON_PARSE_ERROR);
        }
    }
}
