package gradude.springVision.domain.hospital.dto;

import gradude.springVision.domain.hospital.entity.Hospital;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalMapResponseDTO {

    private Long hospitalId;
    private String name;
    private double latitude;
    private double longitude;

    public static HospitalMapResponseDTO from(Hospital hospital) {
        return HospitalMapResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .build();
    }
}
