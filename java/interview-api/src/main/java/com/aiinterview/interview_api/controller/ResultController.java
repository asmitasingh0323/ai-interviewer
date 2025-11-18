package com.aiinterview.interview_api.controller;

import com.aiinterview.interview_api.dto.InterviewSessions;
import com.aiinterview.interview_api.repository.InterviewSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class ResultController {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    @GetMapping("/result/{sessionId}")
    public ResponseEntity<?> getResult(@PathVariable Integer sessionId) {
        try {
            Optional<InterviewSessions> sessionOpt = interviewSessionRepository.findBySessionId(sessionId);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.status(404).body("❌ Invalid session ID");
            }

            InterviewSessions session = sessionOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", session.getSessionId());
            response.put("questionText", session.getQuestion().getQuestionText());
            response.put("answer", session.getAnswer());
            response.put("score", session.getScore());
            response.put("evaluation", session.getEvaluation());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Server Error: " + e.getMessage());
        }
    }
}
