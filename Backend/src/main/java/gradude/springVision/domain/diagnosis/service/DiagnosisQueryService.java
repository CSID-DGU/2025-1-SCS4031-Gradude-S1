package gradude.springVision.domain.diagnosis.service;

import gradude.springVision.domain.diagnosis.dto.response.DiagnosisCalendarResponseDTO;
import gradude.springVision.domain.diagnosis.dto.response.DiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.entity.Diagnosis;
import gradude.springVision.domain.diagnosis.repository.DiagnosisRepository;
import gradude.springVision.domain.hospital.dto.response.HospitalDetailResponseDTO;
import gradude.springVision.domain.hospital.entity.Hospital;
import gradude.springVision.domain.hospital.repository.HospitalRepository;
import gradude.springVision.global.common.response.ErrorCode;
import gradude.springVision.global.common.response.exception.GeneralException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiagnosisQueryService {

    private final DiagnosisRepository diagnosisRepository;
    private final HospitalRepository hospitalRepository;

    public List<DiagnosisCalendarResponseDTO> getDiagnosisCalendar(Long userId) {
        List<Diagnosis> diagnoses = diagnosisRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        return diagnoses.stream()
                .map(DiagnosisCalendarResponseDTO::from)
                .toList();
    }

    public DiagnosisResponseDTO getDiagnosisDetail(Long diagnosisId) {
        Diagnosis diagnosis = diagnosisRepository.findById(diagnosisId)
                .orElseThrow(() -> new GeneralException(ErrorCode.DIAGNOSIS_NOT_FOUND));

        List<Long> hospitalIds = List.of(241L, 671L);

        List<HospitalDetailResponseDTO> hospitalDetails = hospitalIds.stream()
                .map(hospitalId -> {
                    Hospital hospital = hospitalRepository.findById(hospitalId)
                            .orElseThrow(() -> new GeneralException(ErrorCode.HOSPITAL_NOT_FOUND));

                    boolean isOpen = hospital.isEmergency()
                            || (hospital.getOpeningHour() != null && hospital.isOpenNow());

                    double distance = switch (hospitalId.intValue()) {
                        case 241 -> 0.8;
                        case 671 -> 1.2;
                        default -> 0.0; // 예외 처리용 기본값
                    };

                    return HospitalDetailResponseDTO.ofMarker(hospital, distance, isOpen);
                })
                .toList();

        return DiagnosisResponseDTO.from(diagnosis, diagnosis.getLlmResult(), hospitalDetails);
    }
}
