package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;
import jakarta.annotation.Nullable;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DiscountRequest(
        @NotNull DiscountType discountType,
        @NotNull @Positive BigDecimal discountValue,
        @Nullable LocalDate startDate,
        @Nullable LocalDate endDate,
        @Nullable String name,
        @Min(1) int minQuantity
) {}