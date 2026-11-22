package com.evaluator.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AiEvaluationResultDto {
    private Double marksObtained;
    private Integer maximumMarks = 10;
    private Double percentage;
    private List<String> correctConcepts = new ArrayList<>();
    private List<String> missingConcepts = new ArrayList<>();
    private List<String> incorrectConcepts = new ArrayList<>();
    private String feedback;
    private String improvementSuggestions;
    private String evaluationStatus = "COMPLETED";

    public AiEvaluationResultDto() {}

    public Double getMarksObtained() { return marksObtained; }
    public void setMarksObtained(Double marksObtained) { this.marksObtained = marksObtained; }

    public Integer getMaximumMarks() { return maximumMarks; }
    public void setMaximumMarks(Integer maximumMarks) { this.maximumMarks = maximumMarks; }

    public Double getPercentage() { return percentage; }
    public void setPercentage(Double percentage) { this.percentage = percentage; }

    public List<String> getCorrectConcepts() { return correctConcepts; }
    public void setCorrectConcepts(List<String> correctConcepts) { this.correctConcepts = correctConcepts; }

    public List<String> getMissingConcepts() { return missingConcepts; }
    public void setMissingConcepts(List<String> missingConcepts) { this.missingConcepts = missingConcepts; }

    public List<String> getIncorrectConcepts() { return incorrectConcepts; }
    public void setIncorrectConcepts(List<String> incorrectConcepts) { this.incorrectConcepts = incorrectConcepts; }

    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }

    public String getImprovementSuggestions() { return improvementSuggestions; }
    public void setImprovementSuggestions(String improvementSuggestions) { this.improvementSuggestions = improvementSuggestions; }

    public String getEvaluationStatus() { return evaluationStatus; }
    public void setEvaluationStatus(String evaluationStatus) { this.evaluationStatus = evaluationStatus; }
}
