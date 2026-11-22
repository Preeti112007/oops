package com.evaluator.dto;

import com.evaluator.entity.TeacherComment;
import java.time.LocalDateTime;

public class TeacherCommentDto {
    private Long id;
    private String teacherName;
    private String comment;
    private LocalDateTime createdAt;

    public TeacherCommentDto() {}

    public TeacherCommentDto(TeacherComment comment) {
        if (comment != null) {
            this.id = comment.getId();
            this.teacherName = comment.getTeacher() != null ? comment.getTeacher().getName() : "Teacher";
            this.comment = comment.getComment();
            this.createdAt = comment.getCreatedAt();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
