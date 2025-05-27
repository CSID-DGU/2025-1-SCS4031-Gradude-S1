package gradude.springVision.domain.hospital.dto;

import gradude.springVision.domain.hospital.entity.Hospital;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalSearchResponseDTO {

    private Long hospitalId;
    private String name;
    private double distance;
    private double latitude;
    private double longitude;

    public static HospitalSearchResponseDTO of(Hospital hospital, double distance) {
        return HospitalSearchResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .distance(distance)
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .build();
    }
}
