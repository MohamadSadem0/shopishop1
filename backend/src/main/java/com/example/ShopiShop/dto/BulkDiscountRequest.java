package com.example.ShopiShop.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;
import java.util.UUID;

public record BulkDiscountRequest(
        @NotEmpty List<UUID> productIds,
        @Valid DiscountRequest discountRequest
) {}
