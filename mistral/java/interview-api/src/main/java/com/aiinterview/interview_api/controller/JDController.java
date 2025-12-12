package com.aiinterview.interview_api.controller;

import org.springframework.web.bind.annotation.*;

import com.aiinterview.interview_api.messaging.JDValidationListener;
import com.aiinterview.interview_api.messaging.RabbitMQSender;
import com.aiinterview.interview_api.repository.TestsRepository;
import com.aiinterview.interview_api.model.Tests;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.aiinterview.interview_api.messaging.*;
import java.util.*;

@RestController
@RequestMapping("/api/jd")
@CrossOrigin(origins = "*")
public class JDController {

    @Autowired
    private RabbitMQSender rabbitMQSender;

    @Autowired
    private TestsRepository testsRepository;

    @Autowired
    private JDValidationListener validationListener;

    @PostMapping("/generate")
    public ResponseEntity<?> generateInterview(@RequestBody Map<String, String> body) {

        String jd = body.get("jd");

        if (jd == null || jd.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "JD is empty"));
        }

        // ----- MOCK RESPONSE (for testing before adding AI) -----

        Map<String, Object> mockResponse = Map.of(
                "skills", new String[] {
                        "Java", "Spring Boot", "SQL", "Distributed Systems", "AWS"
                },
                "level", "Mid-level",
                "rounds", Map.of(
                        "technical_round", new String[] {
                                "Explain how a distributed system ensures consistency?",
                                "What happens in Spring Boot during application startup?"
                        },
                        "coding_round", new String[] {
                                "Implement LRU Cache.",
                                "Find the longest repeating substring in a string."
                        },
                        "system_design_round", new String[] {
                                "Design a URL Shortener service.",
                                "Design a scalable notification system."
                        }));

        return ResponseEntity.ok(mockResponse);
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateJD(@RequestBody Map<String, String> body) {
        String jd = body.get("jd");

        String correlationId = UUID.randomUUID().toString();

        rabbitMQSender.sendJDForValidation(jd, correlationId);

        return ResponseEntity.ok(Map.of(
                "status", "submitted",
                "correlationId", correlationId));
    }

    @PostMapping("/extract-skills")
    public Map<String, Object> extractSkills(@RequestBody Map<String, String> body) {
        String jd = body.get("jd");

        // Mock extracted skills - replace with AI later
        // List<String> skills = List.of("Java", "Spring Boot", "SQL", "Distributed
        // Systems", "PL/SQL", "AWS");
        List<String> skills = List.of(
                "Object-Oriented Design",
                "Data Structures",
                "Algorithms",
                "Distributed Systems",
                "Problem Solving",
                "Complexity Analysis",
                "TypeScript",
                "NodeJS",
                "Python",
                "Software Development Lifecycle",
                "Unit Testing",
                "Automation Testing",
                "Performance Optimization",
                "High-Performing API Development",
                "MySQL",
                "PostgreSQL",
                "Elasticsearch",
                "Cassandra",
                "SQS",
                "RabbitMQ",
                "Kubernetes",
                "Docker",
                "AWS",
                "GCP",
                "Azure",
                "Memcache",
                "Redis",
                "Varnish",
                "CloudFront",
                "Akamai");

        return Map.of("skills", skills);
    }

    @GetMapping("/validate-result/{id}")
    public ResponseEntity<?> getValidationResult(@PathVariable String id) {

        Map<String, Object> result = validationListener.getResult(id);

        if (result == null) {
            return ResponseEntity.ok(Map.of("status", "pending"));
        }

        validationListener.remove(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/create-test")
    public ResponseEntity<?> createTest(@RequestBody Map<String, String> body) {

        String jd = body.get("jd");
        if (jd == null || jd.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "JD is empty"));
        }

        // 1️⃣ Generate a test ID
        String testId = UUID.randomUUID().toString().substring(0, 8);

        // 2️⃣ Create placeholder test row
        Tests test = new Tests();
        test.setTestId(testId);
        test.setQuestionId(null);
        test.setQuestionText(null);

        testsRepository.save(test);

        // 3️⃣ Send JD to Python question generator worker
        rabbitMQSender.sendJDForQuestionGeneration(jd, testId);
        System.out.println("🚀 JD sent for QUESTION GENERATION for testId = " + testId);

        // 4️⃣ Return response
        return ResponseEntity.ok(Map.of(
                "status", "created",
                "test_id", testId));
    }

}
