package com.evaluator.repository;

import com.evaluator.entity.Evaluation;
import com.evaluator.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    Optional<Evaluation> findBySubmission(Submission submission);
    Optional<Evaluation> findBySubmissionId(Long submissionId);

    @Query("SELECT e FROM Evaluation e WHERE e.submission.student.id = :studentId ORDER BY e.evaluatedAt DESC")
    List<Evaluation> findByStudentId(Long studentId);

    @Query("SELECT e FROM Evaluation e WHERE e.submission.assignment.id = :assignmentId ORDER BY e.evaluatedAt DESC")
    List<Evaluation> findByAssignmentId(Long assignmentId);

    @Query("SELECT AVG(CASE WHEN e.isReviewedByTeacher = true AND e.reviewedMarks IS NOT NULL THEN e.reviewedMarks ELSE e.marksObtained END) FROM Evaluation e WHERE e.evaluationStatus = 'COMPLETED'")
    Double getAverageMarks();

    @Query("SELECT COUNT(e) FROM Evaluation e WHERE e.evaluationStatus = 'COMPLETED'")
    long countCompletedEvaluations();
}
