package com.example.ShopiShop.service;

import com.example.ShopiShop.models.Product;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class DiscountCalculator {
    public BigDecimal calculateDiscountedPrice(Product product) {
        if (!isDiscountValid(product)) {
            return product.getPrice();
        }

        return switch (product.getDiscountType()) {
            case PERCENTAGE ->
                    product.getPrice().subtract(
                            product.getPrice().multiply(product.getDiscountValue().divide(BigDecimal.valueOf(100)))
                    );
            case FIXED_AMOUNT ->
                    product.getPrice().subtract(product.getDiscountValue());
            default -> product.getPrice();
        };
    }

    private boolean isDiscountValid(Product product) {
        LocalDate now = LocalDate.now();
        return Boolean.TRUE.equals(product.getDiscountActive()) &&
                product.getDiscountValue() != null &&
                (product.getDiscountStartDate() == null || !now.isBefore(product.getDiscountStartDate())) &&
                (product.getDiscountEndDate() == null || !now.isAfter(product.getDiscountEndDate()));
    }
}