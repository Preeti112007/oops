package com.evaluator.service;

import com.evaluator.dto.AiEvaluationResultDto;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.model:gemini-1.5-flash}")
    private String model;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    public AiEvaluationResultDto evaluateAnswer(String question,
                                                String referenceAnswer,
                                                String keywordsCriteria,
                                                String studentAnswer,
                                                int maxMarks) {
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("YOUR_GEMINI_API_KEY")) {
            try {
                return callGemini(question, referenceAnswer, keywordsCriteria, studentAnswer, maxMarks);
            } catch (Exception e) {
                log.error("Gemini API call failed: {}", e.getMessage());
                return evaluateLocally(question, referenceAnswer, keywordsCriteria, studentAnswer, maxMarks,
                        "Evaluated using local conceptual checker (Gemini API unavailable: " + e.getMessage() + ")");
            }
        } else {
            return evaluateLocally(question, referenceAnswer, keywordsCriteria, studentAnswer, maxMarks,
                    "Evaluated using local conceptual checker. (Set GEMINI_API_KEY environment variable to use Gemini live API)");
        }
    }

    private AiEvaluationResultDto callGemini(String question,
                                            String referenceAnswer,
                                            String keywordsCriteria,
                                            String studentAnswer,
                                            int maxMarks) throws Exception {
        String prompt = "You are an experienced university examiner.\n\n" +
                "Evaluate the student's answer based on the question, reference answer and marking criteria.\n\n" +
                "Maximum marks: " + maxMarks + ".\n\n" +
                "Evaluation rules:\n" +
                "- Award marks based on conceptual correctness.\n" +
                "- Accept equivalent explanations and different wording.\n" +
                "- Do not require students to reproduce the exact reference answer.\n" +
                "- Identify important concepts covered.\n" +
                "- Identify missing concepts.\n" +
                "- Identify incorrect statements.\n" +
                "- Do not award marks for irrelevant content.\n" +
                "- Do not penalize minor grammar or spelling mistakes unless meaning is affected.\n" +
                "- Do not give full marks when important concepts are missing.\n" +
                "- Be fair and consistent.\n" +
                "- Explain why marks were deducted.\n" +
                "- Never invent content from the reference answer.\n\n" +
                "Question: " + question + "\n" +
                "Reference Answer: " + referenceAnswer + "\n" +
                "Criteria: " + (keywordsCriteria != null ? keywordsCriteria : "N/A") + "\n" +
                "Student Answer: " + studentAnswer + "\n\n" +
                "Return a structured JSON response containing:\n" +
                "{\n" +
                "  \"marksObtained\": 8,\n" +
                "  \"maximumMarks\": " + maxMarks + ",\n" +
                "  \"percentage\": 80,\n" +
                "  \"correctConcepts\": [\"concept 1\"],\n" +
                "  \"missingConcepts\": [\"concept 2\"],\n" +
                "  \"incorrectConcepts\": [],\n" +
                "  \"feedback\": \"Feedback explaining marks\",\n" +
                "  \"improvementSuggestions\": \"How to improve\",\n" +
                "  \"evaluationStatus\": \"COMPLETED\"\n" +
                "}";

        String url = baseUrl + "/" + model + ":generateContent?key=" + apiKey.trim();

        Map<String, Object> textPart = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(textPart));
        Map<String, Object> config = Map.of("temperature", 0.2, "responseMimeType", "application/json");

        Map<String, Object> body = new HashMap<>();
        body.put("contents", List.of(content));
        body.put("generationConfig", config);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JsonNode root = mapper.readTree(response.getBody());
        String text = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

        // Remove markdown code fences if present
        text = text.trim();
        if (text.startsWith("```json")) text = text.substring(7);
        if (text.startsWith("```")) text = text.substring(3);
        if (text.endsWith("```")) text = text.substring(0, text.length() - 3);

        AiEvaluationResultDto result = mapper.readValue(text.trim(), AiEvaluationResultDto.class);

        // Basic validation of marks
        double marks = result.getMarksObtained() != null ? result.getMarksObtained() : 0.0;
        marks = Math.max(0.0, Math.min(marks, (double) maxMarks));
        result.setMarksObtained(Math.round(marks * 10.0) / 10.0);
        result.setMaximumMarks(maxMarks);
        result.setPercentage(Math.round((marks / maxMarks) * 100.0 * 10.0) / 10.0);
        result.setEvaluationStatus("COMPLETED");

        if (result.getCorrectConcepts() == null) result.setCorrectConcepts(new ArrayList<>());
        if (result.getMissingConcepts() == null) result.setMissingConcepts(new ArrayList<>());
        if (result.getIncorrectConcepts() == null) result.setIncorrectConcepts(new ArrayList<>());

        return result;
    }

    private AiEvaluationResultDto evaluateLocally(String question,
                                                  String referenceAnswer,
                                                  String criteria,
                                                  String studentAnswer,
                                                  int maxMarks,
                                                  String note) {
        AiEvaluationResultDto dto = new AiEvaluationResultDto();
        dto.setMaximumMarks(maxMarks);

        if (studentAnswer == null || studentAnswer.trim().length() < 10) {
            dto.setMarksObtained(0.0);
            dto.setPercentage(0.0);
            dto.setCorrectConcepts(new ArrayList<>());
            dto.setMissingConcepts(List.of("Required concepts not addressed"));
            dto.setIncorrectConcepts(List.of("Answer is too brief or empty"));
            dto.setFeedback(note + "\n\nThe student answer is too short to evaluate properly.");
            dto.setImprovementSuggestions("Write a detailed answer explaining the topic.");
            dto.setEvaluationStatus("COMPLETED");
            return dto;
        }

        // Basic keyword matching between student answer and reference answer
        String textToCheck = (referenceAnswer + " " + (criteria != null ? criteria : "")).toLowerCase();
        String studentLower = studentAnswer.toLowerCase();

        String[] words = textToCheck.replaceAll("[^a-zA-Z0-9 ]", "").split("\\s+");
        Set<String> ignore = Set.of("the", "and", "is", "of", "to", "in", "a", "that", "it", "with", "as", "for", "on", "was", "by", "an", "be");

        Set<String> keyTerms = new LinkedHashSet<>();
        for (String w : words) {
            if (w.length() > 3 && !ignore.contains(w)) {
                keyTerms.add(w);
            }
        }

        List<String> covered = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String term : keyTerms) {
            if (studentLower.contains(term)) {
                if (covered.size() < 5) covered.add(capitalize(term) + " discussed");
            } else {
                if (missing.size() < 4) missing.add("Discussion of " + capitalize(term));
            }
        }

        int total = Math.max(keyTerms.size(), 1);
        double ratio = (double) covered.size() / Math.min(total, 5);
        double score = Math.max(1.0, Math.min(maxMarks, Math.round(ratio * maxMarks * 10.0) / 10.0));

        dto.setMarksObtained(score);
        dto.setPercentage(Math.round((score / maxMarks) * 100.0 * 10.0) / 10.0);
        dto.setCorrectConcepts(covered.isEmpty() ? List.of("General understanding") : covered);
        dto.setMissingConcepts(missing);
        dto.setIncorrectConcepts(new ArrayList<>());
        dto.setFeedback(note + "\n\nThe answer covers the core concepts reasonably well with clear explanation.");
        dto.setImprovementSuggestions(missing.isEmpty() ? "Include real-world examples to earn full marks." : "Explain " + String.join(", ", missing) + " in more detail.");
        dto.setEvaluationStatus("COMPLETED");

        return dto;
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }
}
