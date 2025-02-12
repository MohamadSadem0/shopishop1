package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Read-only DTO for VendorPayout responses.
 */
public record VendorPayoutDTO(
        Long id,
        Long storeId,
        UUID orderId,
        BigDecimal amountOwed,
        BigDecimal commissionTaken,
        boolean isPaid,
        String payoutStatus,
        LocalDateTime createdAt,
        LocalDateTime paidAt
) {}

