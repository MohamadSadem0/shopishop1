package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        BigDecimal originalPrice,  // Always shows the base price
        BigDecimal finalPrice,     // Shows price after discount (or original if no discount)
        String imageUrl,
        String categoryName,
        Long storeId,
        boolean isAvailable,
        String storeName,
        Integer quantity,
        List<ReviewResponse> reviews,
        Integer totalSell,
        @Nullable Double averageRating,
        @Nullable DiscountInfo discountInfo,  // Details about the active discount
        @Nullable BigDecimal discountValue
) {}

