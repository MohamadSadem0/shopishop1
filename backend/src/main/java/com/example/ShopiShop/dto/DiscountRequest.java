package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DiscountRequest(
        BigDecimal discountPrice,
        Double discountPercent,
        LocalDate discountStartDate,
        LocalDate discountEndDate
) {}
