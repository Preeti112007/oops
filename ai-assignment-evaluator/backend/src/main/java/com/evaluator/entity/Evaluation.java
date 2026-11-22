package com.evaluator.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "submission_id", nullable = false, unique = true)
    private Submission submission;

    @Column(nullable = false)
    private Double marksObtained;

    @Column(nullable = false)
    private Integer maximumMarks = 10;

    @Column(nullable = false)
    private Double percentage;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> correctConcepts = new ArrayList<>();

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> missingConcepts = new ArrayList<>();

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "TEXT")
    private List<String> incorrectConcepts = new ArrayList<>();

    @Column(nullable = false, columnDefinition = "TEXT")
    private String feedback;

    @Column(columnDefinition = "TEXT")
    private String improvementSuggestions;

    @Column(nullable = false, length = 30)
    private String evaluationStatus = "COMPLETED";

    @Column(nullable = false)
    private Boolean isReviewedByTeacher = false;

    private Double reviewedMarks;

    private LocalDateTime reviewedAt;

    @Column(name = "evaluated_at", updatable = false)
    private LocalDateTime evaluatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TeacherComment> teacherComments = new ArrayList<>();

    public Evaluation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public Double getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Double marksObtained) {
        this.marksObtained = marksObtained;
    }

    public Integer getMaximumMarks() {
        return maximumMarks;
    }

    public void setMaximumMarks(Integer maximumMarks) {
        this.maximumMarks = maximumMarks;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public List<String> getCorrectConcepts() {
        return correctConcepts;
    }

    public void setCorrectConcepts(List<String> correctConcepts) {
        this.correctConcepts = correctConcepts;
    }

    public List<String> getMissingConcepts() {
        return missingConcepts;
    }

    public void setMissingConcepts(List<String> missingConcepts) {
        this.missingConcepts = missingConcepts;
    }

    public List<String> getIncorrectConcepts() {
        return incorrectConcepts;
    }

    public void setIncorrectConcepts(List<String> incorrectConcepts) {
        this.incorrectConcepts = incorrectConcepts;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getImprovementSuggestions() {
        return improvementSuggestions;
    }

    public void setImprovementSuggestions(String improvementSuggestions) {
        this.improvementSuggestions = improvementSuggestions;
    }

    public String getEvaluationStatus() {
        return evaluationStatus;
    }

    public void setEvaluationStatus(String evaluationStatus) {
        this.evaluationStatus = evaluationStatus;
    }

    public Boolean getIsReviewedByTeacher() {
        return isReviewedByTeacher;
    }

    public void setIsReviewedByTeacher(Boolean reviewedByTeacher) {
        isReviewedByTeacher = reviewedByTeacher;
    }

    public Double getReviewedMarks() {
        return reviewedMarks;
    }

    public void setReviewedMarks(Double reviewedMarks) {
        this.reviewedMarks = reviewedMarks;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(LocalDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }

    public List<TeacherComment> getTeacherComments() {
        return teacherComments;
    }

    public void setTeacherComments(List<TeacherComment> teacherComments) {
        this.teacherComments = teacherComments;
    }

    public Double getEffectiveMarks() {
        return Boolean.TRUE.equals(isReviewedByTeacher) && reviewedMarks != null ? reviewedMarks : marksObtained;
    }

    public Double getEffectivePercentage() {
        if (maximumMarks == null || maximumMarks <= 0) return 0.0;
        return (getEffectiveMarks() / maximumMarks) * 100.0;
    }
}
