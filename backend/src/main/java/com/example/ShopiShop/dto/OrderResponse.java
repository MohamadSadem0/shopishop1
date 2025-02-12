//package com.example.ShopiShop.dto;
//
//import com.example.ShopiShop.enums.OrderStatus;
//import java.math.BigDecimal;
//import java.sql.Timestamp;
//import java.util.List;
//import java.util.UUID;
//
//public record OrderResponse(
//        UUID id,
//        Long userId,
//        List<OrderItemResponse> items,
//        BigDecimal totalPrice,
//        OrderStatus status,
//        Timestamp createdAt
//) {}
//

package com.example.ShopiShop.dto;

import java.util.UUID;

public record OrderResponse(UUID orderId, String message) {}
