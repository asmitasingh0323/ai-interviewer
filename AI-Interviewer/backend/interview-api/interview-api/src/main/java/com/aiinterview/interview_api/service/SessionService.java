package com.aiinterview.interview_api.service;

import com.aiinterview.interview_api.dto.InterviewSession;
import com.aiinterview.interview_api.dto.Question;
import com.aiinterview.interview_api.dto.User;
import com.aiinterview.interview_api.repository.InterviewSessionRepository;
import com.aiinterview.interview_api.repository.UserRepository;
import com.aiinterview.interview_api.repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService {

    @Autowired
    private InterviewSessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    public InterviewSession createSession(String userId, Integer questionId, String answer) {
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Question> questionOpt = questionRepository.findById(questionId);

        if (userOpt.isEmpty() || questionOpt.isEmpty()) {
            throw new RuntimeException("User or question not found");
        }

        InterviewSession session = new InterviewSession();
        session.setSessionId(UUID.randomUUID().toString()); // ✅ correct UUID generation
        session.setUser(userOpt.get());
        session.setQuestion(questionOpt.get());
        session.setAnswer(answer);

        return sessionRepository.save(session);
    }
}
