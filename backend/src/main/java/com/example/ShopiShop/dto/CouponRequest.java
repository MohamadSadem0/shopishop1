package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CouponRequest(
        String code,
        Double discountPercent,
        BigDecimal discountAmount,
        Integer usageLimit,
        LocalDate startDate,
        LocalDate endDate,
        Long storeId,
        Boolean isActive
) {}
