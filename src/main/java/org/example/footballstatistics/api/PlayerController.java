package org.example.footballstatistics.api;

import org.example.footballstatistics.dtos.PlayerQuestion;
import org.springframework.http.MediaType;
import org.example.footballstatistics.service.OpenAiService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/player")
public class PlayerController {

    private final OpenAiService openAiService;

    public PlayerController(OpenAiService openAiService) {
        this.openAiService = openAiService;
    }

    @PostMapping(value = "/ask", produces = MediaType.APPLICATION_JSON_VALUE)//Fortæller at vores svar er JSON
    public String ask(@RequestBody PlayerQuestion request) {
        return openAiService.askQuestion(
                request.getPlayerName(),
                request.getQuestion()
        );
    }
}
