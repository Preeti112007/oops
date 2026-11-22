package com.evaluator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SubmissionRequest {

    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;

    @NotBlank(message = "Answer text cannot be blank")
    private String answerText;

    public SubmissionRequest() {}

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
}
