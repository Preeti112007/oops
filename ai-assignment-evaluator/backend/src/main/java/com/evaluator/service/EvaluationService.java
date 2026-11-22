package com.evaluator.service;

import com.evaluator.dto.AiEvaluationResultDto;
import com.evaluator.dto.EvaluationResponse;
import com.evaluator.dto.EvaluationReviewRequest;
import com.evaluator.entity.*;
import com.evaluator.exception.BadRequestException;
import com.evaluator.exception.ResourceNotFoundException;
import com.evaluator.repository.EvaluationRepository;
import com.evaluator.repository.SubmissionRepository;
import com.evaluator.repository.TeacherCommentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final SubmissionRepository submissionRepository;
    private final TeacherCommentRepository teacherCommentRepository;
    private final GeminiService geminiService;

    public EvaluationService(EvaluationRepository evaluationRepository,
                             SubmissionRepository submissionRepository,
                             TeacherCommentRepository teacherCommentRepository,
                             GeminiService geminiService) {
        this.evaluationRepository = evaluationRepository;
        this.submissionRepository = submissionRepository;
        this.teacherCommentRepository = teacherCommentRepository;
        this.geminiService = geminiService;
    }

    @Transactional
    public EvaluationResponse evaluateSubmission(Long submissionId, boolean forceReevaluate) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found: " + submissionId));

        Optional<Evaluation> existing = evaluationRepository.findBySubmissionId(submissionId);
        if (existing.isPresent() && !forceReevaluate) {
            return new EvaluationResponse(existing.get());
        }

        Assignment assignment = submission.getAssignment();
        int maxMarks = assignment.getMaximumMarks() != null ? assignment.getMaximumMarks() : 10;

        AiEvaluationResultDto aiResult = geminiService.evaluateAnswer(
                assignment.getQuestion(),
                assignment.getReferenceAnswer(),
                assignment.getKeywordsCriteria(),
                submission.getAnswerText(),
                maxMarks
        );

        Evaluation evaluation = existing.orElseGet(Evaluation::new);
        evaluation.setSubmission(submission);
        evaluation.setMaximumMarks(maxMarks);
        evaluation.setMarksObtained(aiResult.getMarksObtained());
        evaluation.setPercentage(aiResult.getPercentage());
        evaluation.setCorrectConcepts(aiResult.getCorrectConcepts());
        evaluation.setMissingConcepts(aiResult.getMissingConcepts());
        evaluation.setIncorrectConcepts(aiResult.getIncorrectConcepts());
        evaluation.setFeedback(aiResult.getFeedback());
        evaluation.setImprovementSuggestions(aiResult.getImprovementSuggestions());
        evaluation.setEvaluationStatus("COMPLETED");
        evaluation.setEvaluatedAt(LocalDateTime.now());

        Evaluation saved = evaluationRepository.save(evaluation);

        submission.setStatus(SubmissionStatus.EVALUATED);
        submissionRepository.save(submission);

        return new EvaluationResponse(saved);
    }

    @Transactional(readOnly = true)
    public EvaluationResponse getEvaluationBySubmissionId(Long submissionId) {
        Evaluation evaluation = evaluationRepository.findBySubmissionId(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found for submission: " + submissionId));
        return new EvaluationResponse(evaluation);
    }

    @Transactional(readOnly = true)
    public List<EvaluationResponse> getEvaluationsByStudentId(Long studentId) {
        return evaluationRepository.findByStudentId(studentId).stream()
                .map(EvaluationResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public EvaluationResponse reviewEvaluation(Long evaluationId, EvaluationReviewRequest reviewRequest, User teacher) {
        Evaluation evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Evaluation not found: " + evaluationId));

        int maxMarks = evaluation.getMaximumMarks();
        if (reviewRequest.getReviewedMarks() < 0 || reviewRequest.getReviewedMarks() > maxMarks) {
            throw new BadRequestException("Marks must be between 0 and " + maxMarks);
        }

        evaluation.setIsReviewedByTeacher(true);
        evaluation.setReviewedMarks(reviewRequest.getReviewedMarks());
        evaluation.setReviewedAt(LocalDateTime.now());

        if (reviewRequest.getTeacherComment() != null && !reviewRequest.getTeacherComment().trim().isEmpty()) {
            TeacherComment comment = new TeacherComment(evaluation, teacher, reviewRequest.getTeacherComment().trim());
            teacherCommentRepository.save(comment);
        }

        Submission submission = evaluation.getSubmission();
        if (submission != null) {
            submission.setStatus(SubmissionStatus.REVIEWED);
            submissionRepository.save(submission);
        }

        Evaluation saved = evaluationRepository.save(evaluation);
        return new EvaluationResponse(saved);
    }
}
