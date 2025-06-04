package gradude.springVision.domain.diagnosis.repository;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {

    Optional<Diagnosis> findTopByUserIdOrderByCreatedAtDesc(Long userId);

    List<Diagnosis> findAllByUserIdOrderByCreatedAtDesc(Long userId);
}
