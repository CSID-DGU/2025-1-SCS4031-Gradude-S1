package gradude.springVision.domain.diagnosis.entity;

import gradude.springVision.domain.diagnosis.dto.request.SelfDiagnosisRequestDTO;
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
public class Diagnosis extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @Column(nullable = false)
    private boolean face;

    @Column(nullable = false)
    @Min(0) @Max(1)
    private double faceProbability;

    @Column(nullable = false)
    private boolean speech;

    @Column(nullable = false)
    @Min(0) @Max(1)
    private double speechProbability;

    @Min(0) @Max(1)
    private int gaze; // 시선
    
    @Min(0) @Max(1)
    private int orientation; // 의식 질문

    @Min(0) @Max(1)
    private int arm; // 팔

    @Min(0) @Max(5)
    private int totalScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void updateDiagnosis(SelfDiagnosisRequestDTO dto, int orientation, int totalScore) {
        this.orientation = orientation;
        this.gaze = dto.getGaze();
        this.arm = dto.getArm();
        this.totalScore = totalScore;
    }
}
