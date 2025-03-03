package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        String categoryName,
        BigDecimal effectivePrice,   // <--- new field

        Long storeId,
        boolean isAvailable,
        String storeName,
        Integer quantity,
        List<ReviewResponse> reviews
) {}
