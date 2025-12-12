package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email); // 👈 useful for checking duplicates
}
