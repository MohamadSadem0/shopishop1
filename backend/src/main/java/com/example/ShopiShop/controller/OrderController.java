package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.OrderResponse;
import com.example.ShopiShop.models.Order;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

// You may need to retrieve the currently authenticated user,
// for example, via Spring Security.
@RestController
@RequestMapping("/customer/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestParam String shippingAddress) {
        // For demonstration purposes, assume you have a method to get the current user.
        User currentUser = getCurrentAuthenticatedUser();

        Order order = orderService.createOrderForUser(currentUser, shippingAddress);

        OrderResponse response = new OrderResponse(order.getId(), "Order created successfully.");
        return ResponseEntity.ok(response);
    }

    private User getCurrentAuthenticatedUser() {
        // Implement retrieval of the currently authenticated user,
        // e.g., from a security context or JWT token.
        // For now, throw an exception if not implemented.
        throw new UnsupportedOperationException("Implement user retrieval logic");
    }
}
