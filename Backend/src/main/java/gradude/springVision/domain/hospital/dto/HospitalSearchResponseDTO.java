package gradude.springVision.domain.hospital.dto;

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

    public static HospitalSearchResponseDTO from(Hospital hospital) {
        return HospitalSearchResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .build();
    }
}
