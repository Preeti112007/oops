package com.evaluator.service;

import com.evaluator.dto.AssignmentRequest;
import com.evaluator.dto.AssignmentResponse;
import com.evaluator.entity.Assignment;
import com.evaluator.entity.Role;
import com.evaluator.entity.User;
import com.evaluator.exception.BadRequestException;
import com.evaluator.exception.ResourceNotFoundException;
import com.evaluator.repository.AssignmentRepository;
import com.evaluator.repository.SubmissionRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;

    public AssignmentService(AssignmentRepository assignmentRepository, SubmissionRepository submissionRepository) {
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
    }

    @Transactional
    public AssignmentResponse createAssignment(AssignmentRequest request, User teacher) {
        if (teacher.getRole() != Role.ROLE_TEACHER) {
            throw new AccessDeniedException("Only teachers are permitted to create assignments");
        }

        Assignment assignment = new Assignment();
        assignment.setTitle(request.getTitle().trim());
        assignment.setSubject(request.getSubject().trim());
        assignment.setQuestion(request.getQuestion().trim());
        assignment.setReferenceAnswer(request.getReferenceAnswer().trim());
        assignment.setMaximumMarks(request.getMaximumMarks() != null ? request.getMaximumMarks() : 10);
        assignment.setKeywordsCriteria(request.getKeywordsCriteria());
        assignment.setDeadline(request.getDeadline());
        assignment.setTeacher(teacher);

        Assignment saved = assignmentRepository.save(assignment);
        AssignmentResponse response = new AssignmentResponse(saved);
        response.setSubmissionCount(0L);
        return response;
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> getAllAssignments() {
        return assignmentRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));
        return mapToResponse(assignment);
    }

    @Transactional
    public AssignmentResponse updateAssignment(Long id, AssignmentRequest request, User teacher) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        if (!assignment.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("You can only modify your own assignments");
        }

        assignment.setTitle(request.getTitle().trim());
        assignment.setSubject(request.getSubject().trim());
        assignment.setQuestion(request.getQuestion().trim());
        assignment.setReferenceAnswer(request.getReferenceAnswer().trim());
        if (request.getMaximumMarks() != null) {
            assignment.setMaximumMarks(request.getMaximumMarks());
        }
        assignment.setKeywordsCriteria(request.getKeywordsCriteria());
        assignment.setDeadline(request.getDeadline());

        Assignment updated = assignmentRepository.save(assignment);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteAssignment(Long id, User teacher) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + id));

        if (!assignment.getTeacher().getId().equals(teacher.getId())) {
            throw new AccessDeniedException("You can only delete your own assignments");
        }

        assignmentRepository.delete(assignment);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> searchAssignments(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllAssignments();
        }
        return assignmentRepository.findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrderByCreatedAtDesc(query.trim(), query.trim())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private AssignmentResponse mapToResponse(Assignment assignment) {
        AssignmentResponse resp = new AssignmentResponse(assignment);
        resp.setSubmissionCount(submissionRepository.countByAssignment(assignment));
        return resp;
    }
}
