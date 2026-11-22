package com.evaluator.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class EvaluationReviewRequest {

    @NotNull(message = "Reviewed marks is required")
    @DecimalMin(value = "0.0", message = "Marks cannot be negative")
    @DecimalMax(value = "10.0", message = "Marks cannot exceed maximum marks")
    private Double reviewedMarks;

    private String teacherComment;

    public EvaluationReviewRequest() {}

    public Double getReviewedMarks() { return reviewedMarks; }
    public void setReviewedMarks(Double reviewedMarks) { this.reviewedMarks = reviewedMarks; }

    public String getTeacherComment() { return teacherComment; }
    public void setTeacherComment(String teacherComment) { this.teacherComment = teacherComment; }
}
