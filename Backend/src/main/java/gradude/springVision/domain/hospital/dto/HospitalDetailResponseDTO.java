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

    private String name;
    private double distance;
    private String address;
    private String phoneNumber;
    private OpeningHour openingHour;
    private Boolean isOpen;

    public static HospitalDetailResponseDTO ofMarker(Hospital hospital, double distance, boolean isOpen) {
        return HospitalDetailResponseDTO.builder()
                .name(hospital.getName())
                .address(hospital.getAddress())
                .phoneNumber(hospital.getPhoneNumber())
                .distance(distance)
                .isOpen(isOpen)
                .build();
    }

    public static HospitalDetailResponseDTO ofDetail(Hospital hospital, double distance) {
        return HospitalDetailResponseDTO.builder()
                .name(hospital.getName())
                .address(hospital.getAddress())
                .phoneNumber(hospital.getPhoneNumber())
                .distance(distance)
                .openingHour(hospital.getOpeningHour())
                .build();
    }
}
