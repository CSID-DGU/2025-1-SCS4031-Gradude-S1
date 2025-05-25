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
    private double faceProbability;

    @Column(nullable = false)
    private boolean speech;

    @Column(nullable = false)
    private double speechProbability;

    @Min(0) @Max(3)
    private int alertness; // 의식 수준

    @Min(0) @Max(2)
    private int orientation; // 의식 질문

    @Min(0) @Max(2)
    private int gaze; // 시선

    @Min(0) @Max(3)
    private int visualField; // 시야

    @Min(0) @Max(4)
    private int leftArm; // 왼쪽 팔 운동

    @Min(0) @Max(4)
    private int rightArm; // 오른쪽 팔 운동

    @Min(0) @Max(4)
    private int leftLeg;  // 왼쪽 다리 운동

    @Min(0) @Max(4)
    private int rightLeg; // 오른쪽 다리 운동

    @Min(0) @Max(2)
    private int limbAtaxia; // 운동 실조

    @Min(0) @Max(2)
    private int sensory; // 감각

    @Min(0) @Max(3)
    private int aphasia; // 언어

    @Min(0) @Max(2)
    private int neglect; // 편측 무시

    private int totalScore;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public void updateDiagnosis(boolean speech, double speechProbability) {
        this.speech = speech;
        this.speechProbability = speechProbability;
    }

    public void updateDiagnosis(SelfDiagnosisRequestDTO dto, int totalScore) {
        this.alertness = dto.getAlertness();
        this.orientation = dto.getOrientation();
        this.gaze = dto.getGaze();
        this.visualField = dto.getVisualField();
        this.leftArm = dto.getLeftArm();
        this.rightArm = dto.getRightArm();
        this.leftLeg = dto.getLeftLeg();
        this.rightLeg = dto.getRightLeg();
        this.limbAtaxia = dto.getLimbAtaxia();
        this.sensory = dto.getSensory();
        this.aphasia = dto.getAphasia();
        this.neglect = dto.getNeglect();
        this.totalScore = totalScore;
    }
}
