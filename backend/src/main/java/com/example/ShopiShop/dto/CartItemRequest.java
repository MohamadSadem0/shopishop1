package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record CartItemRequest(
        @NotNull UUID productId,
        @Min(1) int quantity
) {}
