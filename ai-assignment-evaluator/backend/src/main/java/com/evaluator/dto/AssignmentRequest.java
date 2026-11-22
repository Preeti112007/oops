package com.evaluator.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class AssignmentRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Subject is required")
    private String subject;

    @NotBlank(message = "Question is required")
    private String question;

    @NotBlank(message = "Reference answer is required")
    private String referenceAnswer;

    @Min(value = 1, message = "Maximum marks must be at least 1")
    private Integer maximumMarks = 10;

    private String keywordsCriteria;

    private LocalDateTime deadline;

    public AssignmentRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getReferenceAnswer() { return referenceAnswer; }
    public void setReferenceAnswer(String referenceAnswer) { this.referenceAnswer = referenceAnswer; }

    public Integer getMaximumMarks() { return maximumMarks; }
    public void setMaximumMarks(Integer maximumMarks) { this.maximumMarks = maximumMarks; }

    public String getKeywordsCriteria() { return keywordsCriteria; }
    public void setKeywordsCriteria(String keywordsCriteria) { this.keywordsCriteria = keywordsCriteria; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
}
