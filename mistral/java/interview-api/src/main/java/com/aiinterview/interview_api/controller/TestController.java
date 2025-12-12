package com.aiinterview.interview_api.controller;

import com.aiinterview.interview_api.dto.InterviewSessions;
import com.aiinterview.interview_api.messaging.RabbitMQSender;
import com.aiinterview.interview_api.model.Tests;
import com.aiinterview.interview_api.dto.User;

import org.aspectj.weaver.ast.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.aiinterview.interview_api.repository.*;
import org.springframework.web.bind.annotation.*;
import com.aiinterview.interview_api.dto.Question;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @Autowired
    private TestsRepository testsRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private TestsRepository testRepository;

    @PostMapping("/generate_test")
    public ResponseEntity<String> generateTest(@RequestBody Map<String, Object> request) {
        try {
            String testId = (String) request.get("testId");
            Integer questionId = (Integer) request.get("questionId");

            if (testId == null || questionId == null) {
                return ResponseEntity.badRequest().body("Missing testId or questionId");
            }

            Tests test = new Tests();
            test.setTestId(testId);
            test.setQuestionId(questionId);
            // test.setCreatedAt(Timestamp.from(Instant.now()));
            test.setCreatedAt(LocalDateTime.now());

            testsRepository.save(test);
            return ResponseEntity.ok("✅ Test created successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Error: " + e.getMessage());
        }
    }

    @PostMapping("/create_session")
    public ResponseEntity<?> createSession(@RequestBody Map<String, String> request) {
        try {
            String testId = request.get("testId");
            String name = request.get("name");
            String email = request.get("email");

            if (testId == null || name == null || email == null) {
                return ResponseEntity.badRequest().body("Missing required fields.");
            }

            // Find or create user
            User user = userRepository.findByEmail(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setName(name);
                newUser.setEmail(email);
                return userRepository.save(newUser);
            });

            // Get question ID from test ID
            Optional<Tests> testOpt = testsRepository.findFirstByTestId(testId);
            if (testOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid test ID.");
            }

            // Integer questionId = testOpt.get().getQuestionId();
            Integer questionId = testOpt.get().getQuestionId();
            if (questionId == null) {
                return ResponseEntity.badRequest().body("Question not generated yet. Please wait a few seconds.");
            }

            Optional<Question> questionOpt = questionRepository.findById(questionId);

            if (questionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid Question ID");
            }
            String questionText = questionOpt.get().getQuestionText();

            if (questionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid question ID.");
            }

            // Create session (sessionId will be auto-generated)
            // InterviewSessions session = new InterviewSessions();
            // Integer maxSessionId =
            // interviewSessionRepository.findMaxSessionId().orElse(0);
            // int generatedSessionId = maxSessionId + 1;
            String sessionId = UUID.randomUUID().toString().substring(0, 8);
            InterviewSessions session = new InterviewSessions();
            session.setSessionId(sessionId);
            session.setTestId(testId);
            session.setQuestion(questionOpt.get());
            session.setUser(user);

            InterviewSessions saved = interviewSessionRepository.save(session);

            // Response payload
            Map<String, Object> response = new HashMap<>();
            response.put("sessionId", saved.getSessionId()); // Now Integer
            response.put("testId", testId);
            response.put("questionId", questionId);
            response.put("questionText", questionText); // ADD this
            response.put("constraints", questionOpt.get().getConstraintsJson());
            response.put("examples", questionOpt.get().getExamplesJson());
            response.put("name", user.getName());
            response.put("email", user.getEmail());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(500).body("❌ Server error: " + e.getMessage());
        }
    }

    @GetMapping("/get-question/{testId}")
    public ResponseEntity<?> getQuestion(@PathVariable String testId) {

        Optional<Tests> testOpt = testsRepository.findFirstByTestId(testId);
        if (testOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Invalid test ID"));
        }

        Tests test = testOpt.get();

        // If AI has NOT finished generating question yet
        if (test.getQuestionId() == null) {
            return ResponseEntity.ok(Map.of(
                    "status", "pending"));
        }

        // AI has finished → return question
        Optional<Question> q = questionRepository.findById(test.getQuestionId());
        if (q.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "status", "pending"));
        }

        return ResponseEntity.ok(Map.of(
                "status", "ready",
                "question", q.get().getQuestionText()));
    }

    // @GetMapping("/api/tests/{testId}")
    // public ResponseEntity<?> getTestDetails(@PathVariable String testId) {

    // Tests test = testRepository.findFirstByTestId(testId)
    // .orElseThrow(() -> new RuntimeException("Test not found"));

    // Question q = questionRepository.findById(test.getQuestionId())
    // .orElseThrow(() -> new RuntimeException("Question not found"));

    // Map<String, Object> response = new HashMap<>();
    // response.put("questionId", q.getQuestionId());
    // response.put("problem", q.getQuestionText());
    // response.put("constraints", q.getConstraintsJson());
    // response.put("examples", q.getExamplesJson());

    // return ResponseEntity.ok(response);
    // }

}
