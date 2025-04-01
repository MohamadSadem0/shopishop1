package com.example.ShopiShop.exceptions;

// DiscountConflictException.java
public final class DiscountConflictException extends CustomException {
    public DiscountConflictException(String message) {
        super(message);
    }

    public static DiscountConflictException overlappingDiscount() {
        return new DiscountConflictException("Another discount is already active for this period");
    }

    public static DiscountConflictException concurrentModification() {
        return new DiscountConflictException("Discount was modified by another operation");
    }
}
