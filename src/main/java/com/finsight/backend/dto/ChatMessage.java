package com.finsight.backend.dto;


import lombok.Data;

@Data
public class ChatMessage {
    private String sender;
    private String content;
    private String type;  // "CHAT", "JOIN", 등
}
