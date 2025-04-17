package gradude.springVision.domain.user.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import gradude.springVision.domain.user.dto.KakaoUserInfoResponseDTO;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@RequiredArgsConstructor
@Service
public class OAuthCommandService {

    @Value("${spring.security.oauth2.client.registration.kakao.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.kakao.redirect-uri}")
    private String redirectUri;
    @Value("${spring.security.oauth2.client.registration.kakao.client-secret}")
    private String clientSecret;

    /**
     * 인가 코드로 카카오 액세스 토큰 요청
     */
    public String getKakaoAccessToken(String code) {
        RestTemplate restTemplate = new RestTemplate(); // HTTP 통신 위해 RestTemplate 객체 생성

        // 요청 header 설정
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        // 요청 body 설정
        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "authorization_code");
        body.add("client_id", clientId);
        body.add("redirect_uri", redirectUri);
        body.add("code", code);
        body.add("client_secret", clientSecret);

        // 최종 요청 객체 생성
        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(body, headers);

        // 카카오 토큰 요청 API 호출
        ResponseEntity<String> response = restTemplate.exchange(
                "https://kauth.kakao.com/oauth/token",
                HttpMethod.POST,
                kakaoTokenRequest,
                String.class
        );

        try {
            // 응답 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(response.getBody());
            return jsonNode.get("access_token").asText();
        } catch (JsonProcessingException e) {
            throw new GeneralException(ErrorCode.JSON_PARSE_ERROR);
        }
    }

    /**
     * 카카오 액세스 토큰으로 사용자 정보 조회
     */
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
            String picture = jsonNode.get("properties").has("profile_image")? jsonNode.get("properties").get("profile_image").asText() : null;

            return KakaoUserInfoResponseDTO.of(kakaoId, picture);
        } catch (JsonProcessingException e) {
            throw new GeneralException(ErrorCode.JSON_PARSE_ERROR);
        }
    }
}
