package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for creating/updating a VendorPayout.
 * Adjust fields as needed.
 */
public record CreateVendorPayoutRequest(
        Long storeId,
        UUID orderId,
        BigDecimal amountOwed,
        BigDecimal commissionTaken
) {
}
