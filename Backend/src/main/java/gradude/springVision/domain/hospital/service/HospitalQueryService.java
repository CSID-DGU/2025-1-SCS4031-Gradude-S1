package gradude.springVision.domain.hospital.service;

import gradude.springVision.domain.hospital.dto.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.dto.HospitalMarkerResponseDTO;
import gradude.springVision.domain.hospital.dto.HospitalSearchResponseDTO;
import gradude.springVision.domain.hospital.entity.Hospital;
import gradude.springVision.domain.hospital.repository.HospitalRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.PageResponseDTO;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@RequiredArgsConstructor
@Service
public class HospitalQueryService {

    private final HospitalRepository hospitalRepository;

    private final double EARTH_RADIUS = 6371.0;

    // TODO - 뇌졸중 인증센터 여부 넣기

    /**
     * 병원 지도 마커 좌표 리스트 조회
     * 지도 화면의 북동, 남서 모서리 좌표를 기준
     */
    public List<HospitalMarkerResponseDTO> getHospitalMarkers(double neLatitude, double neLongitude, double swLatitude, double swLongitude) {
        List<Object[]> rows = hospitalRepository.findHospitalsWithinBounds(neLatitude, neLongitude, swLatitude, swLongitude);

        return rows.stream()
                .map(row -> {
                    Long id = ((Number) row[0]).longValue();
                    double latitude = ((Number) row[1]).doubleValue();
                    double longitude = ((Number) row[2]).doubleValue();
                    return HospitalMarkerResponseDTO.of(id, latitude, longitude);
                })
                .toList();
    }

    /**
     * 현위치로부터 가까운 병원 (6개) 가까운 순 정렬
     */
    public List<HospitalSearchResponseDTO> getNearestHospitals(double latitude, double longitude) {
        final double[] radiusSteps = {10.0, 30.0, 50.0, 70.0, 100.0};

        Map<Long, HospitalSearchResponseDTO> hospitalMap = new HashMap<>();

        for (double radius : radiusSteps) {
            List<Object[]> rows = hospitalRepository.findHospitalsWithinRadius(latitude, longitude, radius);

            for (Object[] row : rows) {
                Long id = ((Number) row[0]).longValue();
                if (hospitalMap.containsKey(id)) continue; // 중복 제거

                String name = (String) row[1];
                double lat = ((Number) row[2]).doubleValue();
                double lng = ((Number) row[3]).doubleValue();
                double distance = ((Number) row[4]).doubleValue();

                hospitalMap.put(id, HospitalSearchResponseDTO.ofNearest(id, name, lat, lng, distance));
            }

            if (hospitalMap.size() >= 6) break;
        }

        return hospitalMap.values().stream()
                .sorted(Comparator.comparingDouble(HospitalSearchResponseDTO::getDistance))
                .limit(6)
                .toList();
    }

    /**
     * 병원 검색
     * TODO - 거리순 정렬
     */
    public PageResponseDTO<HospitalSearchResponseDTO> searchHospital(double latitude, double longitude, String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank() || keyword.length() < 2) {
            throw new GeneralException(ErrorCode.HOSPITAL_INVALID_SEARCH);
        }

        Page<Hospital> hospitalPage = hospitalRepository.findByNameContaining(keyword, pageable);

        Page<HospitalSearchResponseDTO> dtoPage = hospitalPage.map(hospital -> {
            double distance = calculateDistance(latitude, longitude, hospital.getLatitude(), hospital.getLongitude());
            return HospitalSearchResponseDTO.ofSearch(hospital, distance);
        });

        return PageResponseDTO.of(dtoPage);
    }

    /**
     * 병원 마커 모달 조회
     */
    public HospitalDetailResponseDTO getHospitalModal(double latitude, double longitude, Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

        double distance = calculateDistance(latitude, longitude, hospital.getLatitude(), hospital.getLongitude());

        boolean isOpen = false;
        if (hospital.getOpeningHour() != null) {
            isOpen = hospital.isOpenNow();
        }

        return HospitalDetailResponseDTO.ofMarker(hospital, distance, isOpen);
    }

    /**
     * 병원 상세 조회
     */
    public HospitalDetailResponseDTO getHospitalDetail(double latitude, double longitude, Long hospitalId) {
        Hospital hospital = hospitalRepository.findById(hospitalId)
                .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

        double distance = calculateDistance(latitude, longitude, hospital.getLatitude(), hospital.getLongitude());

        return HospitalDetailResponseDTO.ofDetail(hospital, distance);
    }

    /**
     * 하버사인 공식을 통해 현위치로부터 병원까지의 거리 계산
     */
    public double calculateDistance(double lat, double lng, double hospitalLat, double hospitalLng) {
        double dLat = Math.toRadians(hospitalLat - lat);
        double dLng = Math.toRadians(hospitalLng - lng);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(Math.toRadians(lat)) * Math.cos(Math.toRadians(hospitalLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }
}
