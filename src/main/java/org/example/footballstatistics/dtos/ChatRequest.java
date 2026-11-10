package org.example.footballstatistics.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ChatRequest {
    private final String model;
    private final List<ChatMessage> messages;//En liste der indeholder ChatMessages objekter.

    public ChatRequest(String model, List<ChatMessage> messages) {
        this.model = model;
        this.messages = messages;
    }


}
