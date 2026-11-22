package com.evaluator.repository;

import com.evaluator.entity.Assignment;
import com.evaluator.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTeacherOrderByCreatedAtDesc(User teacher);
    List<Assignment> findAllByOrderByCreatedAtDesc();
    List<Assignment> findByTitleContainingIgnoreCaseOrSubjectContainingIgnoreCaseOrderByCreatedAtDesc(String title, String subject);
}
