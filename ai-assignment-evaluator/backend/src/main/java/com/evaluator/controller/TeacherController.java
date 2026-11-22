package com.evaluator.controller;

import com.evaluator.dto.SubmissionResponse;
import com.evaluator.dto.TeacherDashboardStatsDto;
import com.evaluator.service.TeacherService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@PreAuthorize("hasAuthority('ROLE_TEACHER')")
public class TeacherController {

    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<TeacherDashboardStatsDto> getDashboardStats() {
        return ResponseEntity.ok(teacherService.getDashboardStats());
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionResponse>> getAllSubmissions() {
        return ResponseEntity.ok(teacherService.getAllSubmissions());
    }

    @GetMapping("/export-csv")
    public ResponseEntity<String> exportCsv() {
        String csvData = teacherService.generateCsvResults();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"assignment_evaluations.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvData);
    }
}
