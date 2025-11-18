package com.aiinterview.interview_api.repository;

import com.aiinterview.interview_api.dto.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, String> {
}
