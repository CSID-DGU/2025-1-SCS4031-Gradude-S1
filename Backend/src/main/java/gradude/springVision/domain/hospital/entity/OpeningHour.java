package gradude.springVision.domain.hospital.entity;

import jakarta.persistence.Embeddable;
import lombok.Getter;

import java.time.DayOfWeek;

@Embeddable
@Getter
public class OpeningHour {

    private String monday;
    private String tuesday;
    private String wednesday;
    private String thursday;
    private String friday;
    private String saturday;
    private String sunday;

    public String getByDay(DayOfWeek dayOfWeek) {
        return switch (dayOfWeek) {
            case MONDAY -> monday;
            case TUESDAY -> tuesday;
            case WEDNESDAY -> wednesday;
            case THURSDAY -> thursday;
            case FRIDAY -> friday;
            case SATURDAY -> saturday;
            case SUNDAY -> sunday;
        };
    }
}
