package gradude.springVision.domain.hospital.dto.response;

import gradude.springVision.domain.hospital.entity.Hospital;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalSearchResponseDTO {

    private Long hospitalId;
    private String name;
    private double latitude;
    private double longitude;
    private double distance;

    public static HospitalSearchResponseDTO ofSearch(Hospital hospital, double distance) {
        return HospitalSearchResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .distance(distance)
                .build();
    }

    public static HospitalSearchResponseDTO ofNearest(Long id, String name, double latitude, double longitude, double distance) {
        return HospitalSearchResponseDTO.builder()
                .hospitalId(id)
                .name(name)
                .latitude(latitude)
                .longitude(longitude)
                .distance(distance)
                .build();
    }
}
