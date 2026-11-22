package com.evaluator.dto;

import java.util.List;

public class TeacherDashboardStatsDto {
    private long totalStudents;
    private long totalAssignments;
    private long totalEvaluatedSubmissions;
    private double averageClassMarks;
    private List<SubmissionResponse> recentActivity;

    public TeacherDashboardStatsDto() {}

    public TeacherDashboardStatsDto(long totalStudents, long totalAssignments, long totalEvaluatedSubmissions, double averageClassMarks, List<SubmissionResponse> recentActivity) {
        this.totalStudents = totalStudents;
        this.totalAssignments = totalAssignments;
        this.totalEvaluatedSubmissions = totalEvaluatedSubmissions;
        this.averageClassMarks = averageClassMarks;
        this.recentActivity = recentActivity;
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalAssignments() { return totalAssignments; }
    public void setTotalAssignments(long totalAssignments) { this.totalAssignments = totalAssignments; }

    public long getTotalEvaluatedSubmissions() { return totalEvaluatedSubmissions; }
    public void setTotalEvaluatedSubmissions(long totalEvaluatedSubmissions) { this.totalEvaluatedSubmissions = totalEvaluatedSubmissions; }

    public double getAverageClassMarks() { return averageClassMarks; }
    public void setAverageClassMarks(double averageClassMarks) { this.averageClassMarks = averageClassMarks; }

    public List<SubmissionResponse> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<SubmissionResponse> recentActivity) { this.recentActivity = recentActivity; }
}
