package com.aiinterview.interview_api.controller;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserInfoController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/user-interviews")
    public ResponseEntity<List<Map<String, Object>>> getAllUserInterviews() {
        String sql = """
                    SELECT u.user_id, u.name, u.email, t.test_id, s.session_id,
                           q.question_text, s.answer, s.score, s.evaluation
                    FROM users u
                    JOIN interview_sessions s ON u.user_id = s.user_id
                    JOIN tests t ON s.test_id = t.test_id
                    JOIN questions q ON t.question_id = q.question_id

                """;

        Query nativeQuery = entityManager.createNativeQuery(sql);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = nativeQuery.getResultList();

        List<Map<String, Object>> results = rows.stream().map(cols -> {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("user_id", cols[0]);
            map.put("name", cols[1]);
            map.put("email", cols[2]);
            map.put("test_id", cols[3]);
            map.put("session_id", cols[4]);
            map.put("question_text", cols[5]);
            map.put("answer", cols[6]);
            map.put("score", cols[7]);
            map.put("evaluation", cols[8]);
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(results);
    }
}
