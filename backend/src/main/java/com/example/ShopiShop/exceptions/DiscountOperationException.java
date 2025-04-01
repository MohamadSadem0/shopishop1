package com.example.ShopiShop.exceptions;

import java.math.BigDecimal;

// DiscountOperationException.java
// DiscountOperationException.java
public final class DiscountOperationException extends CustomException {
    public DiscountOperationException(String message) {
        super(message);
    }

    public static DiscountOperationException invalidValue(BigDecimal maxValue) {
        return new DiscountOperationException(
                String.format("Discount value must be between 0.01 and %.2f", maxValue)
        );
    }

    public static DiscountOperationException invalidDateRange() {
        return new DiscountOperationException("End date must be after start date");
    }

    public static DiscountOperationException discountNotActive() {
        return new DiscountOperationException("No active discount to remove");
    }
}

