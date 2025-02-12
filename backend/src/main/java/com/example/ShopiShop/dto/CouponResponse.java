package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponResponse(
        Long id,
        String code,
        Double discountPercent,
        BigDecimal discountAmount,
        Integer usageLimit,
        Integer usedCount,
        LocalDate startDate,
        LocalDate endDate,
        Boolean isActive,
        Long storeId
) {}
