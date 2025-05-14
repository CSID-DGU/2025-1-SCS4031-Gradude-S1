package gradude.springVision.domain.hospital.controller;

import gradude.springVision.domain.hospital.dto.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.service.HospitalQueryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Tag(name = "병원 API", description = "병원 관련 API")
@RequestMapping("/api/hospital")
@RestController
public class HospitalController {

    private final HospitalQueryService hospitalQueryService;

    @GetMapping("/{hospitalId}/marker")
    public HospitalDetailResponseDTO getHospitalMarkerDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return hospitalQueryService.getHospitalMarkerDetail(lat, lng, hospitalId);
    }

    @GetMapping("/{hospitalId}/detail")
    public HospitalDetailResponseDTO getHospitalDetail(@RequestParam double lat, @RequestParam double lng, @PathVariable Long hospitalId) {
        return hospitalQueryService.getHospitalDetail(lat, lng, hospitalId);
    }
}
