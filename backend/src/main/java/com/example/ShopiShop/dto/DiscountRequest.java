package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record DiscountRequest(
        @NotNull(message = "Discount type is required")
        DiscountType discountType,

        @NotNull(message = "Discount value is required")
        @DecimalMin(value = "0.01", message = "Discount value must be at least 0.01")
        BigDecimal discountValue,

        @DecimalMin(value = "0.01", message = "Discounted price must be at least 0.01")
        BigDecimal discountedPrice,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        LocalDate endDate,

        @NotBlank(message = "Discount name is required")
        String name,

        @Min(value = 1, message = "Minimum quantity must be at least 1")
        Integer minQuantity
) {
        public DiscountRequest {
                if (endDate != null && endDate.isBefore(startDate)) {
                        throw new IllegalArgumentException("End date must be after start date");
                }
                if (name == null || name.isBlank()) {
                        name = discountType + " Discount";
                }
                if (minQuantity == null) {
                        minQuantity = 1;
                }
        }
}