
package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record UserOrderResponse(
        UUID orderId,
        LocalDateTime orderDate,
        OrderStatus status,
        BigDecimal totalAmount,
        BigDecimal totalPrice,
        String shippingAddress,
        String cityAddress,
        List<UserOrderItemResponse> orderItems
) {}
