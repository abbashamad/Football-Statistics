package org.example.footballstatistics.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {

    private final String role;//Hvem beskeden kommer fra.
    private final String content;//Selve beskeden.

    public ChatMessage(String role, String content) {
        this.role = role;
        this.content = content;
    }
}
