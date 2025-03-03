package com.example.ShopiShop.dto;


import com.example.ShopiShop.enums.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record StoreOrderResponse(
        UUID orderId,
        LocalDateTime orderDate,
        OrderStatus status,
        List<StoreOrderItemResponse> storeOrderItems
) {}

