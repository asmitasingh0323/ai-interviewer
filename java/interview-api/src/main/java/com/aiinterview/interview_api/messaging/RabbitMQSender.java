package com.aiinterview.interview_api.messaging;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
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

    public void sendSessionIdToWorker(Integer sessionId) {
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
}
