package gradude.springVision.domain.user.controller;

import gradude.springVision.domain.user.dto.request.KakaoLoginRequestDTO;
import gradude.springVision.domain.user.dto.response.LoginResponseDTO;
import gradude.springVision.domain.user.dto.request.SignupRequestDTO;
import gradude.springVision.domain.user.dto.request.TokenRequestDTO;
import gradude.springVision.domain.user.dto.response.TokenResponseDTO;
import gradude.springVision.domain.user.dto.response.UserResponseDTO;
import gradude.springVision.domain.user.service.AuthCommandService;
import gradude.springVision.domain.user.service.UserQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Tag(name = "인증 API", description = "인증 관련 API")
@RequestMapping("/api/auth")
@RestController
public class AuthController {

    private final AuthCommandService authCommandService;
    private final UserQueryService userQueryService;

    @Operation(summary = "카카오 로그인")
    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> kakaoLogin(@RequestBody KakaoLoginRequestDTO kakaoLoginRequestDTO) {
        return ApiResponse.onSuccess(authCommandService.login(kakaoLoginRequestDTO));
    }

    @Operation(summary = "회원가입", description = "최초 로그인일 경우: 추가 정보 기입 <br> kakaoId, profileImageUrl은 카카오 로그인에서 받은 url")
    @PostMapping("/signup")
    public ApiResponse<TokenResponseDTO> signup(@RequestBody @Valid SignupRequestDTO signupRequestDTO) {
        return ApiResponse.onSuccess(authCommandService.signup(signupRequestDTO));
    }

    @Operation(summary = "토큰 재발급")
    @PostMapping("/reissue")
    public ApiResponse<TokenResponseDTO> reissue(@RequestBody TokenRequestDTO tokenRequestDTO) {
        return ApiResponse.onSuccess(authCommandService.reissue(tokenRequestDTO));
    }

    @Operation(summary = "프로필 조회")
    @GetMapping("/profile")
    public ApiResponse<UserResponseDTO> getUserInfo(@AuthenticationPrincipal Long userId) {
        return ApiResponse.onSuccess(userQueryService.getUserInfo(userId));
    }
}
