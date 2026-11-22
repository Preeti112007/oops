package com.evaluator.service;

import com.evaluator.dto.SubmissionRequest;
import com.evaluator.dto.SubmissionResponse;
import com.evaluator.entity.Assignment;
import com.evaluator.entity.Submission;
import com.evaluator.entity.SubmissionStatus;
import com.evaluator.entity.User;
import com.evaluator.exception.BadRequestException;
import com.evaluator.exception.ResourceNotFoundException;
import com.evaluator.repository.AssignmentRepository;
import com.evaluator.repository.SubmissionRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final EvaluationService evaluationService;

    public SubmissionService(SubmissionRepository submissionRepository,
                             AssignmentRepository assignmentRepository,
                             @Lazy EvaluationService evaluationService) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.evaluationService = evaluationService;
    }

    @Transactional
    public SubmissionResponse submitAnswer(SubmissionRequest request, User student) {
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + request.getAssignmentId()));

        if (assignment.getDeadline() != null && LocalDateTime.now().isAfter(assignment.getDeadline())) {
            throw new BadRequestException("Submission deadline has passed on " + assignment.getDeadline());
        }

        // Count previous attempts
        Optional<Submission> previous = submissionRepository
                .findTopByAssignmentAndStudentOrderBySubmissionNumberDesc(assignment, student);
        int attemptNumber = previous.map(s -> s.getSubmissionNumber() + 1).orElse(1);

        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setAnswerText(request.getAnswerText().trim());
        submission.setSubmissionNumber(attemptNumber);
        submission.setStatus(SubmissionStatus.SUBMITTED);
        submission.setSubmittedAt(LocalDateTime.now());

        Submission saved = submissionRepository.save(submission);

        try {
            evaluationService.evaluateSubmission(saved.getId(), false);
            saved = submissionRepository.findById(saved.getId()).orElse(saved);
        } catch (Exception e) {
            // Keep status SUBMITTED if evaluation throws
        }

        return new SubmissionResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByStudent(Long studentId) {
        return submissionRepository.findByStudentIdOrderBySubmittedAtDesc(studentId).stream()
                .map(SubmissionResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentIdOrderBySubmittedAtDesc(assignmentId).stream()
                .map(SubmissionResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubmissionResponse getSubmissionById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + id));
        return new SubmissionResponse(submission);
    }
}
