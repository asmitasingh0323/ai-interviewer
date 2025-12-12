package com.aiinterview.interview_api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;
import com.aiinterview.interview_api.model.Tests;

@Repository
public interface TestsRepository extends JpaRepository<Tests, Integer> {
    Optional<Tests> findFirstByTestId(String testId);
}
