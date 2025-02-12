package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record ReviewRequest(
        @NotNull(message = "Product ID is required") UUID productId,
        @NotNull(message = "User ID is required") Long userId,
        @Min(value = 1, message = "Rating must be at least 1")
        @Max(value = 5, message = "Rating must not exceed 5")
        int rating,
        @NotBlank(message = "Comment must not be blank")
        String comment
) {}
