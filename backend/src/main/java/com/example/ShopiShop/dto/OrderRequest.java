package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

public record OrderRequest(
        @NotNull(message = "User ID is required") Long userId,
        @NotNull(message = "Order items cannot be empty") List<OrderItemRequest> items
) {}

