package gradude.springVision.domain.diagnosis.entity;

import gradude.springVision.domain.user.entity.User;
import gradude.springVision.global.util.BaseEntity;
import jakarta.persistence.*;
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
    private boolean speech;

    private boolean paralysis;

    private boolean language;

    private boolean movement;

    private boolean vision;

    private boolean swallowing;

    private boolean cognition;

    private boolean headache;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

