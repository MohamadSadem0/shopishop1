package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record DiscountResponse(
        UUID productId,
        String productName,
        BigDecimal originalPrice,
        BigDecimal discountPrice,
        DiscountType discountType,
        BigDecimal discountValue,
        LocalDate startDate,
        LocalDate endDate,
        boolean isActive
) {}