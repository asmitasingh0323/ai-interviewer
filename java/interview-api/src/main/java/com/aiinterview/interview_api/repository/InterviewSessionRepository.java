package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.InterviewSessions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.*;

public interface InterviewSessionRepository extends JpaRepository<InterviewSessions, Integer> {
    Optional<InterviewSessions> findBySessionId(Integer sessionId); // 👈 custom finder

    @Query("SELECT MAX(i.sessionId) FROM InterviewSessions i")
    Optional<Integer> findMaxSessionId();
}
