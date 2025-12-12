package com.aiinterview.interview_api.messaging;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import java.util.Map;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class JDValidationListener {

    // Temporary in-memory cache for results
    private final Map<String, Map<String, Object>> resultStore = new ConcurrentHashMap<>();

    public Map<String, Object> getResult(String id) {
        return resultStore.get(id);
    }

    public void remove(String id) {
        resultStore.remove(id);
    }

    @RabbitListener(queues = "jd_validation_results")
    public void receiveValidationResult(String jsonMessage) {
        try {
            ObjectMapper mapper = new ObjectMapper();

            // Parse the received JSON into a Map
            Map<String, Object> messageMap = mapper.readValue(
                    jsonMessage,
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {
                    });

            // Extract fields
            String correlationId = (String) messageMap.get("correlationId");
            Map<String, Object> validationResult = (Map<String, Object>) messageMap.get("result");

            System.out.println("📥 Received JD Validation Result for correlationId = " + correlationId);
            System.out.println("➡ Result: " + validationResult);

            // Store result
            resultStore.put(correlationId, validationResult);

        } catch (Exception e) {
            System.err.println("❌ Failed to parse JD validation result: " + e.getMessage());
            e.printStackTrace();
        }
    }

}
