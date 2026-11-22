package com.evaluator.dto;

import com.evaluator.entity.Evaluation;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class EvaluationResponse {
    private Long id;
    private Long submissionId;
    private String studentName;
    private String studentEmail;
    private String assignmentTitle;
    private String subject;
    private String question;
    private String referenceAnswer;
    private String studentAnswer;
    private Double marksObtained;
    private Integer maximumMarks;
    private Double percentage;
    private List<String> correctConcepts = new ArrayList<>();
    private List<String> missingConcepts = new ArrayList<>();
    private List<String> incorrectConcepts = new ArrayList<>();
    private String feedback;
    private String improvementSuggestions;
    private String evaluationStatus;
    private Boolean isReviewedByTeacher;
    private Double reviewedMarks;
    private Double effectiveMarks;
    private Double effectivePercentage;
    private LocalDateTime reviewedAt;
    private LocalDateTime evaluatedAt;
    private List<TeacherCommentDto> teacherComments = new ArrayList<>();

    public EvaluationResponse() {}

    public EvaluationResponse(Evaluation evaluation) {
        if (evaluation != null) {
            this.id = evaluation.getId();
            if (evaluation.getSubmission() != null) {
                this.submissionId = evaluation.getSubmission().getId();
                this.studentAnswer = evaluation.getSubmission().getAnswerText();
                if (evaluation.getSubmission().getStudent() != null) {
                    this.studentName = evaluation.getSubmission().getStudent().getName();
                    this.studentEmail = evaluation.getSubmission().getStudent().getEmail();
                }
                if (evaluation.getSubmission().getAssignment() != null) {
                    this.assignmentTitle = evaluation.getSubmission().getAssignment().getTitle();
                    this.subject = evaluation.getSubmission().getAssignment().getSubject();
                    this.question = evaluation.getSubmission().getAssignment().getQuestion();
                    this.referenceAnswer = evaluation.getSubmission().getAssignment().getReferenceAnswer();
                }
            }
            this.marksObtained = evaluation.getMarksObtained();
            this.maximumMarks = evaluation.getMaximumMarks();
            this.percentage = evaluation.getPercentage();
            this.correctConcepts = evaluation.getCorrectConcepts() != null ? evaluation.getCorrectConcepts() : new ArrayList<>();
            this.missingConcepts = evaluation.getMissingConcepts() != null ? evaluation.getMissingConcepts() : new ArrayList<>();
            this.incorrectConcepts = evaluation.getIncorrectConcepts() != null ? evaluation.getIncorrectConcepts() : new ArrayList<>();
            this.feedback = evaluation.getFeedback();
            this.improvementSuggestions = evaluation.getImprovementSuggestions();
            this.evaluationStatus = evaluation.getEvaluationStatus();
            this.isReviewedByTeacher = evaluation.getIsReviewedByTeacher();
            this.reviewedMarks = evaluation.getReviewedMarks();
            this.effectiveMarks = evaluation.getEffectiveMarks();
            this.effectivePercentage = evaluation.getEffectivePercentage();
            this.reviewedAt = evaluation.getReviewedAt();
            this.evaluatedAt = evaluation.getEvaluatedAt();
            if (evaluation.getTeacherComments() != null) {
                this.teacherComments = evaluation.getTeacherComments().stream()
                        .map(TeacherCommentDto::new)
                        .collect(Collectors.toList());
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSubmissionId() { return submissionId; }
    public void setSubmissionId(Long submissionId) { this.submissionId = submissionId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getAssignmentTitle() { return assignmentTitle; }
    public void setAssignmentTitle(String assignmentTitle) { this.assignmentTitle = assignmentTitle; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getReferenceAnswer() { return referenceAnswer; }
    public void setReferenceAnswer(String referenceAnswer) { this.referenceAnswer = referenceAnswer; }

    public String getStudentAnswer() { return studentAnswer; }
    public void setStudentAnswer(String studentAnswer) { this.studentAnswer = studentAnswer; }

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

    public Boolean getIsReviewedByTeacher() { return isReviewedByTeacher; }
    public void setIsReviewedByTeacher(Boolean isReviewedByTeacher) { this.isReviewedByTeacher = isReviewedByTeacher; }

    public Double getReviewedMarks() { return reviewedMarks; }
    public void setReviewedMarks(Double reviewedMarks) { this.reviewedMarks = reviewedMarks; }

    public Double getEffectiveMarks() { return effectiveMarks; }
    public void setEffectiveMarks(Double effectiveMarks) { this.effectiveMarks = effectiveMarks; }

    public Double getEffectivePercentage() { return effectivePercentage; }
    public void setEffectivePercentage(Double effectivePercentage) { this.effectivePercentage = effectivePercentage; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public LocalDateTime getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(LocalDateTime evaluatedAt) { this.evaluatedAt = evaluatedAt; }

    public List<TeacherCommentDto> getTeacherComments() { return teacherComments; }
    public void setTeacherComments(List<TeacherCommentDto> teacherComments) { this.teacherComments = teacherComments; }
}
