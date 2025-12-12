package com.aiinterview.interview_api.controller;

import com.aiinterview.interview_api.dto.InterviewSessions;
import com.aiinterview.interview_api.dto.Question;
import com.aiinterview.interview_api.dto.User;
import com.aiinterview.interview_api.repository.InterviewSessionRepository;
import com.aiinterview.interview_api.repository.QuestionRepository;
import com.aiinterview.interview_api.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.aiinterview.interview_api.messaging.RabbitMQSender;

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

    @Autowired
    private RabbitMQSender rabbitMQSender;

    // ✅ 1. Register a user
    @PostMapping("/user")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        return ResponseEntity.ok(userRepository.save(user));
    }

    // // ✅ 3. Submit an answer (answer is optional)
    // @PostMapping("/submit_answers")
    // public ResponseEntity<String> submitAnswers(@RequestBody Map<String, String>
    // request) {
    // try

    // {
    // Integer sessionId = Integer.parseInt(request.get("sessionId"));
    // // Integer userId = Integer.parseInt(request.get("userId"));
    // Integer questionId = Integer.parseInt(request.get("questionId"));
    // String answer = request.get("answer");

    // // Optional<User> user = userRepository.findById(userId);
    // Optional<Question> question = questionRepository.findById(questionId);

    // // System.out.println(questionId + " ids " + userId);

    // // System.out.println(user.isEmpty());
    // // System.out.println(question.isEmpty());
    // if (question.isEmpty()) {
    // return ResponseEntity.badRequest().body("Invalid userId or questionId");
    // }

    // // InterviewSession session = new InterviewSession();
    // // Optional<InterviewSession> session =
    // // InterviewSessionRepository.findById(sessionId);
    // Optional<InterviewSessions> sessionOpt =
    // sessionRepository.findBySessionId(sessionId);
    // if (sessionOpt.isPresent()) {
    // InterviewSessions session = sessionOpt.get();
    // if (answer != null) {
    // session.setAnswer(answer);
    // }
    // sessionRepository.save(session);
    // // After saving the answer:
    // sessionRepository.save(session);

    // // Send sessionId to RabbitMQ
    // rabbitMQSender.sendSessionIdToWorker(sessionId);
    // return ResponseEntity.ok("Answer stored successfully");
    // } else {
    // System.out.println("No session found with sessionId = " + sessionId);
    // return ResponseEntity.badRequest().body("Invalid session_id: " + sessionId);
    // }

    // }catch(

    // Exception e)
    // {
    // return ResponseEntity.badRequest().body("Invalid input: " + e.getMessage());
    // }
    // }

    @PostMapping("/submit_answers")
    public ResponseEntity<String> submitAnswers(@RequestBody Map<String, String> request) {
        try {
            String sessionId = request.get("sessionId");
            Integer questionId = Integer.parseInt(request.get("questionId"));
            String answer = request.get("answer");

            if (answer == null || answer.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Answer cannot be empty.");
            }

            Optional<Question> questionOpt = questionRepository.findById(questionId);
            if (questionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid questionId: " + questionId);
            }

            Optional<InterviewSessions> sessionOpt = sessionRepository.findBySessionId(sessionId);
            if (sessionOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid sessionId: " + sessionId);
            }

            InterviewSessions session = sessionOpt.get();
            session.setAnswer(answer); // ✅ Save multiline answer
            sessionRepository.save(session); // Save updated session

            rabbitMQSender.sendSessionIdToWorker(sessionId); // Trigger async evaluation
            return ResponseEntity.ok("✅ Answer stored and sent for evaluation.");

        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid sessionId or questionId: must be integers.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Server error: " + e.getMessage());
        }
    }

    // ✅ 4. Get all responses by sessionId
    @GetMapping("/results/{sessionId}")
    public ResponseEntity<List<InterviewSessions>> getResults(@PathVariable String sessionId) {
        List<InterviewSessions> sessions = sessionRepository.findAll()
                .stream()
                .filter(s -> s.getSessionId().equals(sessionId))
                .toList();

        return ResponseEntity.ok(sessions);

    }

    @GetMapping("/questions")
    public ResponseEntity<List<Map<String, Object>>> getAllQuestions() {
        List<Map<String, Object>> questions = new ArrayList<>();

        List<Question> questionList = questionRepository.findAll();
        for (Question q : questionList) {
            Map<String, Object> map = new HashMap<>();
            map.put("question_id", q.getQuestionId());
            map.put("question_text", q.getQuestionText());
            map.put("topic", q.getTopic());
            map.put("difficulty_level", q.getDifficultyLevel());
            questions.add(map);
        }

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/questions")
    public ResponseEntity<String> createQuestion(@RequestBody Question newQuestion) {
        questionRepository.save(newQuestion);
        return ResponseEntity.ok("✅ Question added successfully!");
    }

}
