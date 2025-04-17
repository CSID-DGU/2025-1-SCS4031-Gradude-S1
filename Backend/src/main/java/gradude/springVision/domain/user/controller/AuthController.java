package gradude.springVision.domain.user.controller;

import gradude.springVision.domain.user.dto.LoginResponseDTO;
import gradude.springVision.domain.user.dto.SignupRequestDTO;
import gradude.springVision.domain.user.dto.SignupResponseDTO;
import gradude.springVision.domain.user.service.AuthCommandService;
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

    private final AuthCommandService authCommandService;

    @Operation(summary = "카카오 로그인")
    @Parameter(name = "code", description = "query string parameter, 카카오에서 발급 받은 인가코드")
    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> kakaoLogin(@RequestParam("code") String code) {
        return ApiResponse.onSuccess(authCommandService.login(code));
    }

    @Operation(summary = "회원가입",description = "최초 로그인일 경우: 추가 정보 기입 <br> kakaoId, profileImageUrl은 카카오 로그인에서 받은 url")
    @PostMapping("/signup")
    public ApiResponse<SignupResponseDTO> signup(@RequestBody SignupRequestDTO signupRequestDTO) {
        return ApiResponse.onSuccess(authCommandService.signup(signupRequestDTO));
    }
}
