package com.evaluator.dto;

import com.evaluator.entity.Assignment;
import java.time.LocalDateTime;

public class AssignmentResponse {
    private Long id;
    private String title;
    private String subject;
    private String question;
    private String referenceAnswer;
    private Integer maximumMarks;
    private String keywordsCriteria;
    private LocalDateTime deadline;
    private UserDto teacher;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long submissionCount;

    public AssignmentResponse() {}

    public AssignmentResponse(Assignment assignment) {
        if (assignment != null) {
            this.id = assignment.getId();
            this.title = assignment.getTitle();
            this.subject = assignment.getSubject();
            this.question = assignment.getQuestion();
            this.referenceAnswer = assignment.getReferenceAnswer();
            this.maximumMarks = assignment.getMaximumMarks();
            this.keywordsCriteria = assignment.getKeywordsCriteria();
            this.deadline = assignment.getDeadline();
            this.teacher = assignment.getTeacher() != null ? new UserDto(assignment.getTeacher()) : null;
            this.createdAt = assignment.getCreatedAt();
            this.updatedAt = assignment.getUpdatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public UserDto getTeacher() { return teacher; }
    public void setTeacher(UserDto teacher) { this.teacher = teacher; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getSubmissionCount() { return submissionCount; }
    public void setSubmissionCount(Long submissionCount) { this.submissionCount = submissionCount; }
}
