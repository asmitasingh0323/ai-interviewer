package com.aiinterview.interview_api.messaging;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.aiinterview.interview_api.config.RabbitMQConfig;
import com.fasterxml.jackson.databind.ObjectMapper; // 🧠 import this

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class RabbitMQSender {

    @Autowired
    private AmqpTemplate amqpTemplate;

    @Value("${rabbitmq.queue}")
    private String queue;

    public void sendSessionIdToWorker(String sessionId) {
        try {
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("session_id", sessionId);

            // 🧠 Serialize Map to JSON String
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonMessage = objectMapper.writeValueAsString(messageMap);

            // ✨ Now send JSON string
            amqpTemplate.convertAndSend(queue, jsonMessage.getBytes(StandardCharsets.UTF_8));
            System.out.println("📤 Task sent to Python worker with session_id = " + sessionId);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendJDForValidation(String jd, String correlationId) {
        try {
            Map<String, Object> message = Map.of(
                    "jd", jd,
                    "correlationId", correlationId);

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(message);
            byte[] jsonBytes = json.getBytes(StandardCharsets.UTF_8);

            amqpTemplate.convertAndSend(RabbitMQConfig.JD_VALIDATION_REQUESTS, jsonBytes);

            System.out.println("📤 JD sent for validation → queue: " + RabbitMQConfig.JD_VALIDATION_REQUESTS);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendJDForQuestionGeneration(String jd, String correlationId) {
        try {
            Map<String, Object> message = Map.of(
                    "jd", jd,
                    "correlationId", correlationId);

            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writeValueAsString(message);
            byte[] jsonBytes = json.getBytes(StandardCharsets.UTF_8);

            amqpTemplate.convertAndSend("question_generation_requests", jsonBytes);

            System.out.println("📤 JD sent for QUESTION GENERATION → queue: question_generation_requests");
            System.out.println("📤 [SENDER] Publishing JD to question_generation_requests: " + correlationId);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
