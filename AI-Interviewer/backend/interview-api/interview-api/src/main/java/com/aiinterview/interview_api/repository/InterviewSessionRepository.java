package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
}
