package com.evaluator.repository;

import com.evaluator.entity.Assignment;
import com.evaluator.entity.Submission;
import com.evaluator.entity.SubmissionStatus;
import com.evaluator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByStudentOrderBySubmittedAtDesc(User student);
    List<Submission> findByAssignmentOrderBySubmittedAtDesc(Assignment assignment);
    List<Submission> findByAssignmentIdOrderBySubmittedAtDesc(Long assignmentId);
    List<Submission> findByStudentIdOrderBySubmittedAtDesc(Long studentId);
    Optional<Submission> findTopByAssignmentAndStudentOrderBySubmissionNumberDesc(Assignment assignment, User student);
    long countByAssignment(Assignment assignment);
    long countByStatus(SubmissionStatus status);

    @Query("SELECT s FROM Submission s ORDER BY s.submittedAt DESC")
    List<Submission> findAllOrderBySubmittedAtDesc();
}
