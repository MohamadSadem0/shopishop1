package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.DiscountType;
import jakarta.annotation.Nullable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public record ProductResponse(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        String imageUrl,
        String categoryName,
        BigDecimal effectivePrice,
        Long storeId,
        boolean isAvailable,
        String storeName,
        Integer quantity,
        List<ReviewResponse> reviews,

        // Enhanced discount fields
        boolean hasActiveDiscount,
        @Nullable LocalDate discountStartDate,
        @Nullable LocalDate discountEndDate,
        @Nullable String discountName,
        @Nullable DiscountType discountType,
        @Nullable BigDecimal discountValue,
        @Nullable BigDecimal discountedPrice,
        @Nullable Integer discountMinQuantity,

        // Additional product metrics
        Integer totalSell,
        @Nullable Double averageRating
) {
        public String getFormattedDiscount() {
                if (!hasActiveDiscount) return null;

                if (discountType == DiscountType.PERCENTAGE) {
                        return discountValue + "% OFF";
                } else if (discountType == DiscountType.FIXED_AMOUNT) {
                        return "$" + discountValue + " OFF";
                }
                return discountName != null ? discountName : "Special Offer";
        }

        public boolean isDiscountValid() {
                if (!hasActiveDiscount) return false;
                LocalDate now = LocalDate.now();
                return (discountStartDate == null || !now.isBefore(discountStartDate)) &&
                        (discountEndDate == null || !now.isAfter(discountEndDate));
        }
}