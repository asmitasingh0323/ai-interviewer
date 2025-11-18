package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
}
