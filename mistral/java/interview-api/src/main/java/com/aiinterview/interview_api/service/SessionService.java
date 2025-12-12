// package com.aiinterview.interview_api.service;

// import com.aiinterview.interview_api.dto.InterviewSessions;
// import com.aiinterview.interview_api.dto.Question;
// import com.aiinterview.interview_api.dto.User;
// import com.aiinterview.interview_api.repository.InterviewSessionRepository;
// import com.aiinterview.interview_api.repository.UserRepository;
// import com.aiinterview.interview_api.repository.QuestionRepository;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.sql.Timestamp;
// import java.time.Instant;
// import java.util.Optional;
// import java.util.concurrent.ThreadLocalRandom;

// @Service
// public class SessionService {

// @Autowired
// private InterviewSessionRepository sessionRepository;

// @Autowired
// private UserRepository userRepository;

// @Autowired
// private QuestionRepository questionRepository;

// public InterviewSessions createSession(Integer userId, Integer questionId,
// String answer) {
// Optional<User> userOpt = userRepository.findById(userId);
// Optional<Question> questionOpt = questionRepository.findById(questionId);

// if (userOpt.isEmpty() || questionOpt.isEmpty()) {
// throw new RuntimeException("User or question not found");
// }

// InterviewSessions session = new InterviewSessions();

// // Generate a pseudo-random session ID (since it's now INTEGER)
// int randomSessionId = ThreadLocalRandom.current().nextInt(100000, 999999);
// session.setSessionId(randomSessionId);

// session.setUser(userOpt.get());
// session.setQuestion(questionOpt.get());
// session.setAnswer(answer);
// session.setCreatedAt(Timestamp.from(Instant.now())); // optional

// return sessionRepository.save(session);
// }
// }
