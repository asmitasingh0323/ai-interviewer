// package com.aiinterview.interview_api.messaging;

// import com.aiinterview.interview_api.dto.Question;
// import com.aiinterview.interview_api.model.Tests;
// import com.aiinterview.interview_api.repository.QuestionRepository;
// import com.aiinterview.interview_api.repository.TestsRepository;
// import com.aiinterview.interview_api.messaging.RabbitMQSender;

// // import org.json.JSONObject;
// import com.fasterxml.jackson.databind.JsonNode;
// import com.fasterxml.jackson.databind.ObjectMapper;

// import org.springframework.amqp.rabbit.annotation.RabbitListener;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;

// import java.nio.charset.StandardCharsets;

// @Component
// public class QuestionGenerationListener {

// @Autowired
// private TestsRepository testsRepository;

// @Autowired
// private QuestionRepository questionRepository;

// private final ObjectMapper objectMapper = new ObjectMapper();

// @RabbitListener(queues = "question_generation_results")
// public void receiveGeneratedQuestion(byte[] messageBytes) {
// try {
// String json = new String(messageBytes, StandardCharsets.UTF_8);

// // Parse JSON with Jackson
// JsonNode msg = objectMapper.readTree(json);

// String testId = msg.get("correlationId").asText();
// String questionText = msg.get("question").asText();

// System.out.println("📥 Received AI question for testId = " + testId);
// System.out.println("📝 Question text = " + questionText);

// // Save into questions table
// Question q = new Question();
// q.setQuestionText(questionText);
// q.setDifficultyLevel("medium"); // placeholder
// questionRepository.save(q);

// // Update tests table
// Tests t = testsRepository.findFirstByTestId(testId).orElseThrow();
// t.setQuestionId(q.getQuestionId());
// t.setQuestionText(questionText);
// testsRepository.save(t);

// System.out.println("💾 Saved AI question → question_id = " +
// q.getQuestionId());

// } catch (Exception e) {
// e.printStackTrace();
// }
// }
// }
package com.aiinterview.interview_api.messaging;

import com.aiinterview.interview_api.dto.Question;
import com.aiinterview.interview_api.model.Tests;
import com.aiinterview.interview_api.repository.QuestionRepository;
import com.aiinterview.interview_api.repository.TestsRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Map;

@Service
public class QuestionGenerationResultListener {
    @Autowired
    private TestsRepository testsRepository;

    @Autowired
    private QuestionRepository questionRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public QuestionGenerationResultListener(TestsRepository testsRepository,
            QuestionRepository questionRepository) {
        this.testsRepository = testsRepository;
        this.questionRepository = questionRepository;
    }

    // @RabbitListener(queues = "question_generation_results")
    // public void handleQuestionResult(byte[] messageBytes) {
    // System.out.println("🔥 LISTENER ACTIVE, raw msg = " + new
    // String(messageBytes));
    // try {
    // String json = new String(messageBytes, StandardCharsets.UTF_8);
    // Map<String, Object> msg = objectMapper.readValue(json, Map.class);

    // String testId = (String) msg.get("correlationId");
    // String questionText = (String) msg.get("question");

    // System.out.println("📩 Received AI question for testId = " + testId);
    // System.out.println("👉 Question text = " + questionText);

    // // 1️⃣ Find test entry
    // Tests test = testsRepository.findFirstByTestId(testId).orElse(null);
    // if (test == null) {
    // System.out.println("❌ ERROR: Test not found for testId = " + testId);
    // return;
    // }

    // // 2️⃣ Insert question into questions table
    // Question q = new Question();
    // q.setQuestionText(questionText);
    // q.setDifficultyLevel("medium");
    // q.setTopic("coding");
    // q = questionRepository.save(q);

    // // 3️⃣ Update test entry with question_id
    // test.setQuestionId(q.getQuestionId());
    // test.setQuestionText(q.getQuestionText());
    // testsRepository.save(test);

    // System.out.println("✅ Saved AI question → question_id = " +
    // q.getQuestionId());

    // } catch (Exception e) {
    // e.printStackTrace();
    // }
    // }
}
