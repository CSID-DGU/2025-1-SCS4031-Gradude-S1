package gradude.springVision.domain.diary.entity;

import gradude.springVision.domain.user.entity.User;
import gradude.springVision.global.util.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Diary extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    @Min(1) @Max(5)
    private int drinking;

    @Column(nullable = false)
    @Min(1) @Max(5)
    private int exercise;

    @Column(nullable = false)
    @Min(1) @Max(5)
    private int smoking;

    @Column(nullable = false)
    @Min(1) @Max(5)
    private int snack;

    @Column(nullable = false)
    @Min(1) @Max(5)
    private int vegetable;

    @Column(nullable = false)
    @Min(0) @Max(100)
    private int healthScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
