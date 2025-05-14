package gradude.springVision.domain.hospital.entity;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpeningHour {

    private String monday;

    private String tuesday;

    private String wednesday;

    private String thursday;

    private String friday;

    private String saturday;

    private String sunday;

    /**
     * 현시각 기준 병원 운영 여부
     */
    public boolean isOpenNow() {
        DayOfWeek today = LocalDate.now().getDayOfWeek(); // 오늘 요일
        String hours = switch (today) {
            case MONDAY -> monday;
            case TUESDAY -> tuesday;
            case WEDNESDAY -> wednesday;
            case THURSDAY -> thursday;
            case FRIDAY -> friday;
            case SATURDAY -> saturday;
            case SUNDAY -> sunday;
        };

        if (hours == null) {
            return false;
        }

        String[] parts = hours.split("~");

        LocalTime now = LocalTime.now(); // 현재 시간

        LocalTime start = LocalTime.parse(parts[0]); // 병원 시작 시간
        LocalTime end = LocalTime.parse(parts[1]); // 병원 마감 시간

        return !now.isBefore(start) && now.isBefore(end);
    }
}
