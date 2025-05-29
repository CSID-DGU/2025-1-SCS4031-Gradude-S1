package gradude.springVision.domain.diagnosis.controller;

import gradude.springVision.domain.diagnosis.dto.request.FinalDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.FinalDiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.service.FinalDiagnosisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class FinalDiagnosisController {

    private final FinalDiagnosisService finalDiagnosisService;

    @PostMapping("/final")
    public FinalDiagnosisResponseDTO analyzeSymptoms(@RequestBody FinalDiagnosisRequestDTO request) {
        return finalDiagnosisService.analyzeSymptoms(request.getSymptoms());
    }
}