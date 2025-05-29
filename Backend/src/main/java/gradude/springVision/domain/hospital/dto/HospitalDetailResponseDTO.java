package gradude.springVision.domain.hospital.dto;

import gradude.springVision.domain.hospital.entity.Hospital;
import gradude.springVision.domain.hospital.entity.OpeningHour;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class HospitalDetailResponseDTO {

    private Long hospitalId;
    private String name;
    private double distance;
    private String address;
    private String phoneNumber;
    private boolean isOpen;
    private OpeningHour openingHour;
    private boolean strokeCenter;
    private double latitude;
    private double longitude;

    public static HospitalDetailResponseDTO ofMarker(Hospital hospital, double distance, boolean isOpen) {
        return HospitalDetailResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .distance(distance)
                .address(hospital.getAddress())
                .phoneNumber(hospital.getPhoneNumber())
                .isOpen(isOpen)
                .strokeCenter(hospital.isStrokeCenter())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .build();
    }

    public static HospitalDetailResponseDTO ofDetail(Hospital hospital, double distance) {
        return HospitalDetailResponseDTO.builder()
                .hospitalId(hospital.getId())
                .name(hospital.getName())
                .distance(distance)
                .address(hospital.getAddress())
                .phoneNumber(hospital.getPhoneNumber())
                .openingHour(hospital.getOpeningHour())
                .strokeCenter(hospital.isStrokeCenter())
                .latitude(hospital.getLatitude())
                .longitude(hospital.getLongitude())
                .build();
    }
}
