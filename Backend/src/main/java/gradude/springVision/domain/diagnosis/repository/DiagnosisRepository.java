package gradude.springVision.domain.diagnosis.repository;

import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiagnosisRepository extends JpaRepository<Diagnosis, Long> {

}
