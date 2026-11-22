package com.evaluator.service;

import com.evaluator.dto.SubmissionResponse;
import com.evaluator.dto.TeacherDashboardStatsDto;
import com.evaluator.entity.Role;
import com.evaluator.entity.Submission;
import com.evaluator.repository.AssignmentRepository;
import com.evaluator.repository.EvaluationRepository;
import com.evaluator.repository.SubmissionRepository;
import com.evaluator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherService {

    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;
    private final SubmissionRepository submissionRepository;
    private final EvaluationRepository evaluationRepository;

    public TeacherService(UserRepository userRepository,
                          AssignmentRepository assignmentRepository,
                          SubmissionRepository submissionRepository,
                          EvaluationRepository evaluationRepository) {
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.evaluationRepository = evaluationRepository;
    }

    @Transactional(readOnly = true)
    public TeacherDashboardStatsDto getDashboardStats() {
        long totalStudents = userRepository.countByRole(Role.ROLE_STUDENT);
        long totalAssignments = assignmentRepository.count();
        long totalEvaluated = evaluationRepository.countCompletedEvaluations();
        Double avg = evaluationRepository.getAverageMarks();
        double classAverage = avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;

        List<SubmissionResponse> recentActivity = submissionRepository.findAllOrderBySubmittedAtDesc().stream()
                .limit(10)
                .map(SubmissionResponse::new)
                .collect(Collectors.toList());

        return new TeacherDashboardStatsDto(
                totalStudents,
                totalAssignments,
                totalEvaluated,
                classAverage,
                recentActivity
        );
    }

    @Transactional(readOnly = true)
    public List<SubmissionResponse> getAllSubmissions() {
        return submissionRepository.findAllOrderBySubmittedAtDesc().stream()
                .map(SubmissionResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public String generateCsvResults() {
        StringBuilder sb = new StringBuilder();
        sb.append("Submission ID,Student Name,Student Email,Assignment,Subject,Marks,Maximum Marks,Percentage,Status,Reviewed By Teacher,Teacher Comments,Submitted At\n");

        List<Submission> list = submissionRepository.findAllOrderBySubmittedAtDesc();
        for (Submission s : list) {
            String studentName = s.getStudent() != null ? s.getStudent().getName() : "";
            String studentEmail = s.getStudent() != null ? s.getStudent().getEmail() : "";
            String title = s.getAssignment() != null ? s.getAssignment().getTitle() : "";
            String subject = s.getAssignment() != null ? s.getAssignment().getSubject() : "";

            double marks = 0.0;
            int max = s.getAssignment() != null ? s.getAssignment().getMaximumMarks() : 10;
            double pct = 0.0;
            boolean reviewed = false;
            String comments = "";

            if (s.getEvaluation() != null) {
                marks = s.getEvaluation().getEffectiveMarks();
                pct = s.getEvaluation().getEffectivePercentage();
                reviewed = Boolean.TRUE.equals(s.getEvaluation().getIsReviewedByTeacher());
                if (s.getEvaluation().getTeacherComments() != null && !s.getEvaluation().getTeacherComments().isEmpty()) {
                    comments = s.getEvaluation().getTeacherComments().get(0).getComment();
                }
            }

            sb.append(s.getId()).append(",")
              .append("\"").append(studentName.replace("\"", "\"\"")).append("\",")
              .append("\"").append(studentEmail.replace("\"", "\"\"")).append("\",")
              .append("\"").append(title.replace("\"", "\"\"")).append("\",")
              .append("\"").append(subject.replace("\"", "\"\"")).append("\",")
              .append(marks).append(",")
              .append(max).append(",")
              .append(String.format("%.1f", pct)).append("%,")
              .append(s.getStatus().name()).append(",")
              .append(reviewed ? "YES" : "NO").append(",")
              .append("\"").append(comments.replace("\"", "\"\"")).append("\",")
              .append(s.getSubmittedAt()).append("\n");
        }

        return sb.toString();
    }
}
