package org.example.footballstatistics.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;

@Service
public class FootballService {

    private final WebClient webClient;

    public FootballService(@Value("${app.football.url}") String url,
                           @Value("${app.football.api-key}") String key){

        this.webClient= WebClient.builder()
                .baseUrl(url)
                .defaultHeader("x-apisports-key", key)
                .build();

    }

    public String getTeam(){
        try {
            return webClient.get()
                    .uri("/teams?league=119&season=2023")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block(Duration.ofSeconds(20));
        } catch (WebClientResponseException e){
            System.out.println("Football API status: " + e.getStatusCode());
            System.out.println("Football API message: " + e.getResponseBodyAsString());
            throw e;
        }

    }


}
