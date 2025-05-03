package gradude.springVision.domain.diagnosis.entity;

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
    @Min(0) @Max(100)
    private int face;

    @Column(nullable = false)
    @Min(0) @Max(100)
    private int speech;

    // TODO: 설문 자가 진단 목록 추가

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

