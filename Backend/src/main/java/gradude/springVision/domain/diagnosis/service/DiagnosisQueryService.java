package gradude.springVision.domain.diagnosis.service;

import gradude.springVision.domain.diagnosis.dto.response.DiagnosisCalendarResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.diagnosis.repository.DiagnosisRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisQueryService {

    private final DiagnosisRepository diagnosisRepository;

    public List<DiagnosisCalendarResponseDTO> getDiagnosisCalendar(Long userId) {
        List<Diagnosis> diagnoses = diagnosisRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        return diagnoses.stream()
                .map(DiagnosisCalendarResponseDTO::from)
                .toList();
    }

    public DiagnosisResponseDTO getDiagnosisDetail(Long diagnosisId) {
        Diagnosis diagnosis = diagnosisRepository.findById(diagnosisId)
                .orElseThrow(() -> new GeneralException(ErrorCode.DIAGNOSIS_NOT_FOUND));

        return DiagnosisResponseDTO.from(diagnosis, diagnosis.getLlmResult(), List.of());
    }
}
