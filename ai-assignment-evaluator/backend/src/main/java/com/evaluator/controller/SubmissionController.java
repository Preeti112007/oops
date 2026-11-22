package com.evaluator.controller;

import com.evaluator.dto.SubmissionRequest;
import com.evaluator.dto.SubmissionResponse;
import com.evaluator.entity.User;
import com.evaluator.repository.UserRepository;
import com.evaluator.security.UserPrincipal;
import com.evaluator.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    public SubmissionController(SubmissionService submissionService, UserRepository userRepository) {
        this.submissionService = submissionService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<SubmissionResponse> submitAnswer(
            @Valid @RequestBody SubmissionRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User student = userRepository.findById(currentUser.getId()).orElseThrow();
        SubmissionResponse response = submissionService.submitAnswer(request, student);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByStudent(studentId));
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<SubmissionResponse>> getSubmissionsByAssignment(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(submissionService.getSubmissionsByAssignment(assignmentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionResponse> getSubmissionById(@PathVariable Long id) {
        return ResponseEntity.ok(submissionService.getSubmissionById(id));
    }
}
