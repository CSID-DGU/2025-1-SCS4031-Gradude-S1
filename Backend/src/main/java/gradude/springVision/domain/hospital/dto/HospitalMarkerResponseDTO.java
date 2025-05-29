package gradude.springVision.domain.hospital.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalMarkerResponseDTO {

    private Long hospitalId;
    private double latitude;
    private double longitude;

    public static HospitalMarkerResponseDTO of(Long hospitalId, double latitude, double longitude) {
        return HospitalMarkerResponseDTO.builder()
                .hospitalId(hospitalId)
                .latitude(latitude)
                .longitude(longitude)
                .build();
    }
}
