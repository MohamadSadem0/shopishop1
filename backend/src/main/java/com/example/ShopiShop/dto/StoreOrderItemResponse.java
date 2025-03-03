package com.example.ShopiShop.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record StoreOrderItemResponse(
        UUID orderItemId,
        String productName,
        int quantity,
        BigDecimal price,
        String image
) {
}
