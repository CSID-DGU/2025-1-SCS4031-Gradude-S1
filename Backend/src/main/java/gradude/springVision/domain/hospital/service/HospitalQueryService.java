package gradude.springVision.domain.hospital.service;

import gradude.springVision.domain.hospital.dto.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.HospitalSearchResponseDTO;
import gradude.springVision.domain.hospital.entity.Hospital;
import gradude.springVision.domain.hospital.repository.HospitalRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class HospitalQueryService {

    private final HospitalRepository hospitalRepository;

    /**
     * 지도 마커 기준 병원 리스트 조회
     */


    /**
     * 현위치로부터 가까운 병원 (6개)
     */


    /**
     * 병원 검색
     */
    public Page<HospitalSearchResponseDTO> searchHospital(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank() || keyword.length() < 2) {
            throw new GeneralException(ErrorCode.HOSPITAL_INVALID_SEARCH);
        }

        Page<Hospital> page = hospitalRepository.findByNameContaining(keyword, pageable);

        return page.map(HospitalSearchResponseDTO::from);
    }

    /**
     * 병원 마커 상세 조회
     */
    public HospitalDetailResponseDTO getHospitalMarkerDetail(double lat, double lng, Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

        double distance = calculateDistance(lat, lng, hospital.getLatitude(), hospital.getLongitude());

        boolean isOpen = false;
        if (hospital.getOpeningHour() != null) {
            isOpen = hospital.getOpeningHour().isOpenNow();
        }

        return HospitalDetailResponseDTO.ofMarker(hospital, distance, isOpen);
    }

    /**
     * 병원 상세 조회
     */
    public HospitalDetailResponseDTO getHospitalDetail(double lat, double lng, Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

        double distance = calculateDistance(lat, lng, hospital.getLatitude(), hospital.getLongitude());

        return HospitalDetailResponseDTO.ofDetail(hospital, distance);
    }

    /**
     * 하버사인 공식을 통해 현위치로부터 병원까지의 거리 계산
     */
    public double calculateDistance(double lat, double lng, double hospitalLat, double hospitalLng) {
        final double R = 6371.0;

        double dLat = Math.toRadians(hospitalLat - lat);
        double dLng = Math.toRadians(hospitalLng - lng);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat)) * Math.cos(Math.toRadians(hospitalLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}
