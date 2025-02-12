package com.example.ShopiShop.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        int rating,
        String comment,
        Long userId,
        String userName,
        String productName,
        LocalDateTime createdAt
) {}
