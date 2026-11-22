package com.evaluator.controller;

import com.evaluator.dto.EvaluationResponse;
import com.evaluator.dto.EvaluationReviewRequest;
import com.evaluator.entity.User;
import com.evaluator.repository.UserRepository;
import com.evaluator.security.UserPrincipal;
import com.evaluator.service.EvaluationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
public class EvaluationController {

    private final EvaluationService evaluationService;
    private final UserRepository userRepository;

    public EvaluationController(EvaluationService evaluationService, UserRepository userRepository) {
        this.evaluationService = evaluationService;
        this.userRepository = userRepository;
    }

    @PostMapping("/evaluate/{submissionId}")
    public ResponseEntity<EvaluationResponse> evaluateSubmission(
            @PathVariable Long submissionId,
            @RequestParam(required = false, defaultValue = "false") boolean force) {
        return ResponseEntity.ok(evaluationService.evaluateSubmission(submissionId, force));
    }

    @GetMapping("/{submissionId}")
    public ResponseEntity<EvaluationResponse> getEvaluationBySubmissionId(@PathVariable Long submissionId) {
        return ResponseEntity.ok(evaluationService.getEvaluationBySubmissionId(submissionId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<EvaluationResponse>> getEvaluationsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(evaluationService.getEvaluationsByStudentId(studentId));
    }

    @PutMapping("/{evaluationId}/review")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<EvaluationResponse> reviewEvaluation(
            @PathVariable Long evaluationId,
            @Valid @RequestBody EvaluationReviewRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User teacher = userRepository.findById(currentUser.getId()).orElseThrow();
        return ResponseEntity.ok(evaluationService.reviewEvaluation(evaluationId, request, teacher));
    }
}
