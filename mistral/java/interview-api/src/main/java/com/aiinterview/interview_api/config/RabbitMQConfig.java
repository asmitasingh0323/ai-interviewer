// package com.aiinterview.interview_api.config;

// import org.springframework.amqp.core.Queue;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;

// @Configuration
// public class RabbitMQConfig {

// public static final String TASK_QUEUE = "task_queue";

// @Bean
// public Queue queue() {
// return new Queue(TASK_QUEUE, true); // durable queue
// }
// }
package com.aiinterview.interview_api.config;

import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Already existing
    public static final String TASK_QUEUE = "task_queue";

    // NEW queues for JD validation
    public static final String JD_VALIDATION_REQUESTS = "jd_validation_requests";
    public static final String JD_VALIDATION_RESULTS = "jd_validation_results";

    @Bean
    public Queue taskQueue() {
        return new Queue(TASK_QUEUE, true);
    }

    @Bean
    public Queue jdValidationRequestsQueue() {
        return new Queue(JD_VALIDATION_REQUESTS, true);
    }

    @Bean
    public Queue jdValidationResultsQueue() {
        return new Queue(JD_VALIDATION_RESULTS, true);
    }

    @Bean
    public Queue questionGenerationRequestQueue() {
        return new Queue("question_generation_requests", true);
    }

}
