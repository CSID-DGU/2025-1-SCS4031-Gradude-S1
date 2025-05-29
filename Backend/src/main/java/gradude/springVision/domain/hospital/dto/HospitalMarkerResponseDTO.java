package gradude.springVision.domain.hospital.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class HospitalMarkerResponseDTO {

    private Long hospitalId;
    private double latitude;
    private double longitude;
    private boolean strokeCenter;

    public static HospitalMarkerResponseDTO of(Long hospitalId, double latitude, double longitude, boolean strokeCenter) {
        return HospitalMarkerResponseDTO.builder()
                .hospitalId(hospitalId)
                .latitude(latitude)
                .longitude(longitude)
                .strokeCenter(strokeCenter)
                .build();
    }
}
