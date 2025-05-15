package gradude.springVision.domain.hospital.controller;

import gradude.springVision.domain.hospital.dto.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.HospitalSearchResponseDTO;
import gradude.springVision.domain.hospital.service.HospitalQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Tag(name = "병원 API", description = "병원 관련 API")
@RequestMapping("/api/hospital")
@RestController
public class HospitalController {

    private final HospitalQueryService hospitalQueryService;

    @Operation(summary = "병원 마커 상세 조회", description = "openingHour: null 고정")
    @Parameters({
            @Parameter(name = "lat", description = "위도"),
            @Parameter(name = "lng", description = "경도"),
            @Parameter(name = "hospitalId", description = "병원id")
    })
    @GetMapping("/{hospitalId}/marker")
    public ApiResponse<HospitalDetailResponseDTO> getHospitalMarkerDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return ApiResponse.onSuccess(hospitalQueryService.getHospitalMarkerDetail(lat, lng, hospitalId));
    }

    @Operation(summary = "병원 상세 조회", description = "isOpen: null 고정")
    @Parameters({
            @Parameter(name = "lat", description = "위도"),
            @Parameter(name = "lng", description = "경도"),
            @Parameter(name = "hospitalId", description = "병원id")
    })
    @GetMapping("/{hospitalId}/detail")
    public ApiResponse<HospitalDetailResponseDTO> getHospitalDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return ApiResponse.onSuccess(hospitalQueryService.getHospitalDetail(lat, lng, hospitalId));
    }

    @Operation(summary = "병원 검색", description = "2글자 이상 입력 -> 페이지네이션 병원 리스트")
    @Parameters({
            @Parameter(name = "keyword", description = "검색 키워드 (2자 이상)" ),
            @Parameter(name = "page", description = "페이지 번호 (0부터 시작)", example = "0"),
            @Parameter(name = "size", description = "페이지 크기", example = "6")
    })
    @GetMapping("/search")
    public ApiResponse<Page<HospitalSearchResponseDTO>> searchHospital(@RequestParam String keyword,
                                                                       @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.onSuccess(hospitalQueryService.searchHospital(keyword, pageable));
    }
}
