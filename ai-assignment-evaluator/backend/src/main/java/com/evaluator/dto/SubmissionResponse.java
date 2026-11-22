package com.evaluator.dto;

import com.evaluator.entity.Submission;
import com.evaluator.entity.SubmissionStatus;
import java.time.LocalDateTime;

public class SubmissionResponse {
    private Long id;
    private Long assignmentId;
    private String assignmentTitle;
    private String subject;
    private String question;
    private Integer maximumMarks;
    private UserDto student;
    private String answerText;
    private Integer submissionNumber;
    private SubmissionStatus status;
    private LocalDateTime submittedAt;
    private EvaluationResponse evaluation;

    public SubmissionResponse() {}

    public SubmissionResponse(Submission submission) {
        if (submission != null) {
            this.id = submission.getId();
            if (submission.getAssignment() != null) {
                this.assignmentId = submission.getAssignment().getId();
                this.assignmentTitle = submission.getAssignment().getTitle();
                this.subject = submission.getAssignment().getSubject();
                this.question = submission.getAssignment().getQuestion();
                this.maximumMarks = submission.getAssignment().getMaximumMarks();
            }
            if (submission.getStudent() != null) {
                this.student = new UserDto(submission.getStudent());
            }
            this.answerText = submission.getAnswerText();
            this.submissionNumber = submission.getSubmissionNumber();
            this.status = submission.getStatus();
            this.submittedAt = submission.getSubmittedAt();
            if (submission.getEvaluation() != null) {
                this.evaluation = new EvaluationResponse(submission.getEvaluation());
            }
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getAssignmentTitle() { return assignmentTitle; }
    public void setAssignmentTitle(String assignmentTitle) { this.assignmentTitle = assignmentTitle; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public Integer getMaximumMarks() { return maximumMarks; }
    public void setMaximumMarks(Integer maximumMarks) { this.maximumMarks = maximumMarks; }

    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }

    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }

    public Integer getSubmissionNumber() { return submissionNumber; }
    public void setSubmissionNumber(Integer submissionNumber) { this.submissionNumber = submissionNumber; }

    public SubmissionStatus getStatus() { return status; }
    public void setStatus(SubmissionStatus status) { this.status = status; }

    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }

    public EvaluationResponse getEvaluation() { return evaluation; }
    public void setEvaluation(EvaluationResponse evaluation) { this.evaluation = evaluation; }
}
