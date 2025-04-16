package gradude.springVision.domain.user.controller;

import gradude.springVision.domain.user.dto.KakaoUserInfoResponseDTO;
import gradude.springVision.domain.user.service.OAuthCommandService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Tag(name = "인증 API", description = "인증 관련 API")
@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final OAuthCommandService OAuthCommandService;

    @Operation(summary = "카카오 소셜 로그인")
    @Parameter(name = "code", description = "RequestParam, 카카오에서 발급 받은 인가코드")
    @PostMapping("/login")
    public ApiResponse<?> kakaoLogin(@RequestParam("code") String code) {
        String token = OAuthCommandService.getKakaoAccessToken(code);
        KakaoUserInfoResponseDTO kakaoUserInfo = OAuthCommandService.getKakaoUserInfo(token);
        return ApiResponse.onSuccess(kakaoUserInfo);
    }
}
