package gradude.springVision.domain.hospital.controller;

import gradude.springVision.domain.hospital.dto.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.service.HospitalQueryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
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
    public HospitalDetailResponseDTO getHospitalMarkerDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return hospitalQueryService.getHospitalMarkerDetail(lat, lng, hospitalId);
    }

    @Operation(summary = "병원 상세 조회", description = "isOpen: null 고정")
    @Parameters({
            @Parameter(name = "lat", description = "위도"),
            @Parameter(name = "lng", description = "경도"),
            @Parameter(name = "hospitalId", description = "병원id")
    })
    @GetMapping("/{hospitalId}/detail")
    public HospitalDetailResponseDTO getHospitalDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return hospitalQueryService.getHospitalDetail(lat, lng, hospitalId);
    }
}
