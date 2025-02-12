    package com.example.ShopiShop.dto;

    import java.math.BigDecimal;
    import java.util.UUID;

    public record CartItemResponse(
            Long id,
            String productName,
            UUID productId,
            String imageUrl,
            BigDecimal price,
            int quantity
    ) {}
