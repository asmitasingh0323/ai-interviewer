package com.aiinterview.interview_api.dto;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "tests")
public class Tests {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "test_id", unique = true)
    private String testId;

    @Column(name = "question_id", nullable = false)
    private Integer questionId;

    @Column(name = "created_at")
    private Timestamp createdAt;

    // Getters and Setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTestId() {
        return testId;
    }

    public void setTestId(String testId) {
        this.testId = testId;
    }

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
