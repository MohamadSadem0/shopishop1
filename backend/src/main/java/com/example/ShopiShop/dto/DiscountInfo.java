package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDate;

// Separate DiscountInfo record
public record DiscountInfo(
        DiscountType discountType,
        BigDecimal discountValue,
        LocalDate startDate,
        LocalDate endDate,
        String name,
        int minQuantity
) {
}
