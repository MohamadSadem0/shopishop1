package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record OrderItemRequest(
        @NotNull(message = "Product ID is required") UUID productId,
        @Min(value = 1, message = "Quantity must be at least 1") int quantity
) {}
