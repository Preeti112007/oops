package com.evaluator.repository;

import com.evaluator.entity.TeacherComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeacherCommentRepository extends JpaRepository<TeacherComment, Long> {
    List<TeacherComment> findByEvaluationIdOrderByCreatedAtAsc(Long evaluationId);
}
