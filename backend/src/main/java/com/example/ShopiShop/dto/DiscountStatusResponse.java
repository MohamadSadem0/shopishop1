package com.example.ShopiShop.dto;


import java.math.BigDecimal;
import java.util.UUID;

public record DiscountStatusResponse(
        UUID productId,
        String productName,
        BigDecimal originalPrice,
        BigDecimal currentPrice,
        DiscountInfo discountInfo,
        boolean isActive,
        Long daysRemaining
) {}