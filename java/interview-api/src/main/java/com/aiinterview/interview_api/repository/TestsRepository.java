package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.Tests;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface TestsRepository extends JpaRepository<Tests, Integer> {
    Optional<Tests> findFirstByTestId(String testId);
}
