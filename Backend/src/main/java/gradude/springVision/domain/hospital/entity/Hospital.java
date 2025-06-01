package gradude.springVision.domain.hospital.entity;

import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import gradude.springVision.global.util.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Hospital extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double latitude;

    @Column(nullable = false)
    private double longitude;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String phoneNumber;

    @Column(nullable = false)
    private boolean emergency;

    @Embedded
    private OpeningHour openingHour;

    @Column(nullable = false)
    private boolean strokeCenter;

    /**
     * 현재 시간 기준 병원 운영 여부
     */
    public boolean isOpenNow() {
        // 응급실이 있으면 항상 운영 중
        if (emergency) {
            return true;
        }

        DayOfWeek today = LocalDate.now().getDayOfWeek(); // 오늘 요일
        String hours = openingHour.getByDay(today);

        if (hours == null) {
            return false;
        }

        try {
            // 운영 시간 데이터 "09:00~18:00" 형식
            String[] hour = hours.split("~");

            // 시작 시간과 종료 시간 앞뒤 공백 제거 후 LocalTime 객체로 변환
            LocalTime start = LocalTime.parse(hour[0].trim());  // "09:00"
            LocalTime end = LocalTime.parse(hour[1].trim());    // "18:00"

            LocalTime now = LocalTime.now(); // 현재 시각

            return !now.isBefore(start) && now.isBefore(end);
        } catch (Exception e) {
            throw new GeneralException(ErrorCode.INVALID_HOSPITAL_OPENING_HOURS);
        }
    }
}
