package gradude.springVision.domain.diagnosis.controller;

import gradude.springVision.domain.diagnosis.dto.request.FinalDiagnosisRequestDTO;
import gradude.springVision.domain.diagnosis.dto.response.LlmDiagnosisResponseDTO;
import gradude.springVision.domain.diagnosis.service.LlmDiagnosisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/diagnosis")
@RequiredArgsConstructor
public class FinalDiagnosisController {

    private final LlmDiagnosisService llmDiagnosisService;

    @PostMapping("/final")
    public LlmDiagnosisResponseDTO analyzeSymptoms(@RequestBody FinalDiagnosisRequestDTO request) {
        return llmDiagnosisService.analyzeSymptoms(request.getSymptoms());
    }
}