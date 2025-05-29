package gradude.springVision.domain.diagnosis.service;

import com.theokanning.openai.completion.chat.ChatCompletionChoice;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;
import gradude.springVision.domain.diagnosis.dto.response.FinalDiagnosisResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FinalDiagnosisService {

    @Value("${openai.model}")
    private String model;

    private final OpenAiService openAiService;

    public FinalDiagnosisResponseDTO analyzeSymptoms(String symptoms) {
        String persona = "당신은 뇌졸중 임상 진단 및 치료 전문가입니다.\n" +
                "환자가 자연어로 표현한 증상을 바탕으로, 현재 임상적으로 고려해야 할 진단 소견, 관련된 뇌졸중 척도(예: CPSS, LAPSS, FAST 등)의 의미,\n" +
                "그리고 적절한 치료 권고와 추후 관리 방안을 전문적이면서도 이해하기 쉽게 한국어로 설명해 주세요.";

        String template = "아래는 환자의 증상 설명입니다:\n\n\"" + symptoms + "\"\n\n" +
                "이 증상을 기반으로 다음을 작성해 주세요:\n" +
                "1) 임상적으로 의심되는 뇌졸중 가능성 및 진단 소견\n" +
                "2) 관련된 병원전진단척도(예: CPSS, LAPSS, FAST 등)에서 어떤 평가 항목에 해당하는지와 점수 가능성\n" +
                "3) 응급 처치 또는 병원 이송 권고 등 치료 방향\n" +
                "4) 추후 관리 및 유의사항\n\n" +
                "답변은 자연스럽고 전문적으로 작성해 주세요.";

        List<ChatMessage> messages = List.of(
                new ChatMessage("system", persona),
                new ChatMessage("user", template)
        );

        ChatCompletionRequest request = ChatCompletionRequest.builder()
                .model(model)
                .messages(messages)
                .temperature(0.0)
                .build();

        List<ChatCompletionChoice> choices = openAiService.createChatCompletion(request).getChoices();
        String result = choices.isEmpty() ? "응답이 없습니다." : choices.get(0).getMessage().getContent();
        return new FinalDiagnosisResponseDTO(result);
    }
}
