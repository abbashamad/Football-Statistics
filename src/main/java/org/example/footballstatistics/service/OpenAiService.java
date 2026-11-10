package org.example.footballstatistics.service;

import org.example.footballstatistics.dtos.ChatMessage;
import org.example.footballstatistics.dtos.ChatRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.List;

@Service
public class OpenAiService {

    private final WebClient webClient;
    private final String model;

    public OpenAiService(
            @Value("${app.openai.url}") String url,
            @Value("${app.openai.api-key}") String apiKey,
            @Value("${app.openai.model}") String model) {

        this.model = model;

        this.webClient = WebClient.builder()
                .baseUrl(url)
                .defaultHeader("Authorization", "Bearer " + apiKey)//Den her header openai bruger til API-nøglen.
                .build();
    }

    public String askQuestion(String playerName, String question) {
        ChatMessage instructions = new ChatMessage(
                "system",
                "You are a football expert. Answer questions about "
                        + playerName + ". If you are unsure about fact, say so."
        );

        ChatMessage userMessage = new ChatMessage("user", question);

        ChatRequest request = new ChatRequest(
                model,
                List.of(instructions, userMessage)//Samler vores 2 beskeder i en liste.
        );

        return webClient.post()//Sender data til API'et
                .contentType(MediaType.APPLICATION_JSON)//Fortæller at vi sender JSON.
                .bodyValue(request)//Lægger vores ChatRequest i forespørgelsen. Spring omdanner objektet til JSON.
                .retrieve()
                .bodyToMono(String.class)
                .block(Duration.ofSeconds(60));
    }

}
