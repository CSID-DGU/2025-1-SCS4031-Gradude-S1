package gradude.springVision.domain.hospital.controller;
import gradude.springVision.domain.hospital.dto.response.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.response.HospitalMarkerResponseDTO;
import gradude.springVision.domain.hospital.dto.response.HospitalSearchResponseDTO;
import gradude.springVision.domain.hospital.service.HospitalQueryService;
import gradude.springVision.global.common.response.ApiResponse;
import gradude.springVision.global.common.response.PageResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Tag(name = "병원 API", description = "병원 관련 API")
@RequestMapping("/api/hospital")
@RestController
public class HospitalController {

    private final HospitalQueryService hospitalQueryService;

    @Operation(summary = "병원 지도 마커 좌표 리스트 조회")
    @Parameters({
            @Parameter(name = "neLatitude", description = "북동 위도"),
            @Parameter(name = "neLongitude", description = "북동 경도"),
            @Parameter(name = "swLatitude", description = "남서 위도"),
            @Parameter(name = "swLongitude", description = "남서 경도")
    })
    @GetMapping
    public ApiResponse<List<HospitalMarkerResponseDTO>> getHospitalMarkers(@RequestParam double neLatitude, double neLongitude, double swLatitude, double swLongitude) {
        return ApiResponse.onSuccess(hospitalQueryService.getHospitalMarkers(neLatitude, neLongitude, swLatitude, swLongitude));
    }

    @Operation(summary = "가까운 병원 6개 조회(검색창 눌렀을 때 뜨는거)")
    @Parameters({
            @Parameter(name = "latitude", description = "현위치 위도"),
            @Parameter(name = "longitude", description = "현위치 경도")
    })
    @GetMapping("/nearest")
    public ApiResponse<List<HospitalSearchResponseDTO>> getNearestHospital(@RequestParam double latitude, @RequestParam double longitude) {
        return ApiResponse.onSuccess(hospitalQueryService.getNearestHospitals(latitude, longitude));
    }

    @Operation(summary = "병원 마커 모달 조회", description = "openingHour: null 고정")
    @Parameters({
            @Parameter(name = "latitude", description = "현위치 위도"),
            @Parameter(name = "longitude", description = "현위치 경도"),
            @Parameter(name = "hospitalId", description = "병원id")
    })
    @GetMapping("/{hospitalId}/marker")
    public ApiResponse<HospitalDetailResponseDTO> getHospitalModal(@RequestParam double latitude, @RequestParam double longitude, @PathVariable Long hospitalId) {
        return ApiResponse.onSuccess(hospitalQueryService.getHospitalModal(latitude, longitude, hospitalId));
    }

    @Operation(summary = "병원 상세 조회", description = "isOpen: null 고정")
    @Parameters({
            @Parameter(name = "latitude", description = "현위치 위도"),
            @Parameter(name = "longitude", description = "현위치 경도"),
            @Parameter(name = "hospitalId", description = "병원id")
    })
    @GetMapping("/{hospitalId}/detail")
    public ApiResponse<HospitalDetailResponseDTO> getHospitalDetail(@RequestParam double latitude, @RequestParam double longitude, @PathVariable Long hospitalId) {
        return ApiResponse.onSuccess(hospitalQueryService.getHospitalDetail(latitude, longitude, hospitalId));
    }

    @Operation(summary = "병원 검색", description = "2글자 이상 입력 -> 페이지네이션 병원 리스트")
    @Parameters({
            @Parameter(name = "latitude", description = "현위치 위도"),
            @Parameter(name = "longitude", description = "현위치 경도"),
            @Parameter(name = "keyword", description = "검색 키워드 (2자 이상)" ),
            @Parameter(name = "page", description = "페이지 번호 (0부터 시작)", example = "0"),
            @Parameter(name = "size", description = "페이지 크기", example = "6")
    })
    @GetMapping("/search")
    public ApiResponse<PageResponseDTO<HospitalSearchResponseDTO>> searchHospital(@RequestParam double latitude, @RequestParam double longitude,
                                                                                  @RequestParam String keyword,
                                                                                  @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "6") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ApiResponse.onSuccess(hospitalQueryService.searchHospital(latitude, longitude, keyword, pageable));
    }
}
