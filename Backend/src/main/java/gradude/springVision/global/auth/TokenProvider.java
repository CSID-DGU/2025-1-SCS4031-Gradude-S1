package gradude.springVision.global.auth;

import gradude.springVision.domain.user.dto.TokenRequestDTO;
import gradude.springVision.domain.user.dto.TokenResponseDTO;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Collections;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Component
public class TokenProvider {

    @Value("${jwt.secret}")
    private String secretKey;
    @Value("${jwt.access-token-expire-time}")
    private long ACCESS_TOKEN_EXPIRE_TIME;
    @Value("${jwt.refresh-token-expire-time}")
    private long REFRESH_TOKEN_EXPIRE_TIME;
    private Key key;
    private final RedisTemplate<String, String> redisTemplate;

    /**
     * secretKey를 이용해 HMAC SHA 키를 초기화
     */
    @PostConstruct
    public void init() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Access Token 생성
     */
    public String createAccessToken(Long userId) {
        long now = new Date().getTime();
        Date expiry = new Date(now + ACCESS_TOKEN_EXPIRE_TIME);

        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("tokenType", "access")
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Refresh Token 생성, Redis 저장
     */
    public String createRefreshToken(Long userId) {
        long now = new Date().getTime();
        Date expiry = new Date(now + REFRESH_TOKEN_EXPIRE_TIME);

        String refreshToken = Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("tokenType", "refresh")
                .setExpiration(expiry)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        redisTemplate.opsForValue().set("refreshToken:" + userId, refreshToken, REFRESH_TOKEN_EXPIRE_TIME, TimeUnit.SECONDS);

        return refreshToken;
    }

    /**
     * Access Token에서 Authentication 객체 추출
     */
    public Authentication getAuthentication(String accessToken) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(accessToken)
                    .getBody();

            Long userId = Long.parseLong(claims.getSubject());
            return new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
        } catch (ExpiredJwtException e) {
            throw new GeneralException(ErrorCode.EXPIRED_TOKEN);
        }
    }

    /**
     * 토큰 유효성 검증
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            throw new GeneralException(ErrorCode.INVALID_TOKEN_SIGNATURE);
        } catch (ExpiredJwtException e) {
            throw new GeneralException(ErrorCode.EXPIRED_TOKEN);
        } catch (UnsupportedJwtException e) {
            throw new GeneralException(ErrorCode.UNSUPPORTED_TOKEN);
        } catch (IllegalArgumentException e) {
            throw new GeneralException(ErrorCode.INVALID_TOKEN);
        }
    }

    /**
     * 토큰 재발급
     */
    public TokenResponseDTO reissueToken(TokenRequestDTO tokenRequestDTO) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(tokenRequestDTO.getRefreshToken())
                    .getBody();

            Long userId = Long.parseLong(claims.getSubject());

            // Redis에 저장된 Refresh Token 일치 여부 검사
            String redisKey = "refreshToken:" + userId;
            String savedRefreshToken = redisTemplate.opsForValue().get(redisKey);
            if (!tokenRequestDTO.getRefreshToken().equals(savedRefreshToken)) {
                throw new GeneralException(ErrorCode.INVALID_TOKEN);
            }

            String accessToken = createAccessToken(userId);
            String refreshToken = createRefreshToken(userId);

            return TokenResponseDTO.of(accessToken, refreshToken);
        } catch (ExpiredJwtException e) {
            throw new GeneralException(ErrorCode.EXPIRED_TOKEN);
        } catch (JwtException | IllegalArgumentException e) {
            throw new GeneralException(ErrorCode.INVALID_TOKEN);
        }
    }
}
