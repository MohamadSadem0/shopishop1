package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateProductQuantityRequest(
        @NotNull(message = "Quantity is required")
        @Min(value = 0, message = "Quantity must be non-negative")
        Integer quantity
) {}
