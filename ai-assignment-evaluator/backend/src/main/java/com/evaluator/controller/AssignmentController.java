package com.evaluator.controller;

import com.evaluator.dto.AssignmentRequest;
import com.evaluator.dto.AssignmentResponse;
import com.evaluator.entity.User;
import com.evaluator.repository.UserRepository;
import com.evaluator.security.UserPrincipal;
import com.evaluator.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;
    private final UserRepository userRepository;

    public AssignmentController(AssignmentService assignmentService, UserRepository userRepository) {
        this.assignmentService = assignmentService;
        this.userRepository = userRepository;
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<AssignmentResponse> createAssignment(
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User teacher = userRepository.findById(currentUser.getId()).orElseThrow();
        AssignmentResponse response = assignmentService.createAssignment(request, teacher);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AssignmentResponse>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentResponse> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getAssignmentById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<AssignmentResponse> updateAssignment(
            @PathVariable Long id,
            @Valid @RequestBody AssignmentRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User teacher = userRepository.findById(currentUser.getId()).orElseThrow();
        return ResponseEntity.ok(assignmentService.updateAssignment(id, request, teacher));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_TEACHER')")
    public ResponseEntity<Void> deleteAssignment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User teacher = userRepository.findById(currentUser.getId()).orElseThrow();
        assignmentService.deleteAssignment(id, teacher);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<AssignmentResponse>> searchAssignments(@RequestParam(required = false) String q) {
        return ResponseEntity.ok(assignmentService.searchAssignments(q));
    }
}
