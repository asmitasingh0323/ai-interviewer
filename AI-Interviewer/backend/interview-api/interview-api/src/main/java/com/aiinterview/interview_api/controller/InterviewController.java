package com.aiinterview.interview_api.controller;

import com.aiinterview.interview_api.dto.InterviewSession;
import com.aiinterview.interview_api.dto.Question;
import com.aiinterview.interview_api.dto.User;
import com.aiinterview.interview_api.repository.InterviewSessionRepository;
import com.aiinterview.interview_api.repository.QuestionRepository;
import com.aiinterview.interview_api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api")
public class InterviewController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private InterviewSessionRepository sessionRepository;

    // ✅ 1. Register a user
    @PostMapping("/user")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userRepository.save(user));
    }

    // ✅ 2. Get all questions
    @GetMapping("/questions")
    public ResponseEntity<List<Question>> getAllQuestions() {
        return ResponseEntity.ok(questionRepository.findAll());
    }

    // ✅ 3. Submit an answer (answer is optional)
    @PostMapping("/submit_answers")
    public ResponseEntity<String> submitAnswers(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            String userId = request.get("userId");
            String questionIdStr = request.get("questionId");
            String answer = request.get("answer"); // can be null

            if (sessionId == null || userId == null || questionIdStr == null) {
                return ResponseEntity.badRequest().body("Missing required fields: sessionId, userId, or questionId");
            }

            int questionId = Integer.parseInt(questionIdStr);

            Optional<User> user = userRepository.findById(userId);
            Optional<Question> question = questionRepository.findById(questionId);

            if (user.isEmpty() || question.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid userId or questionId");
            }

            InterviewSession session = new InterviewSession();
            session.setSessionId(sessionId);
            session.setUser(user.get());
            session.setQuestion(question.get());

            if (answer != null) {
                session.setAnswer(answer);
            }

            sessionRepository.save(session);
            return ResponseEntity.ok("Answer stored successfully");

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
        }
    }

    // ✅ 4. Get all responses by sessionId
    @GetMapping("/results/{sessionId}")
    public ResponseEntity<List<InterviewSession>> getResults(@PathVariable String sessionId) {
        List<InterviewSession> sessions = sessionRepository.findAll()
                .stream()
                .filter(s -> s.getSessionId().equals(sessionId))
                .toList();

        return ResponseEntity.ok(sessions);
    }
}
