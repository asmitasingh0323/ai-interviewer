package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Integer> {
    // You can add custom methods here like:
    // Optional<Question> findByTopic(String topic);
}
