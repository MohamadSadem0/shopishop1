package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.OrderRequest;
import com.example.ShopiShop.dto.OrderResponse;
import com.example.ShopiShop.dto.PaymentUpdateRequest;
import com.example.ShopiShop.models.Order;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.UUID;

@RestController
@RequestMapping("/customer/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository; // Make sure this exists

    public OrderController(OrderService orderService, UserRepository userRepository) {
        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestBody @Valid OrderRequest orderRequest) {
        // Retrieve the current user from the security context
        User currentUser = getCurrentAuthenticatedUser();

        // Use the shipping address from the orderRequest
        Order order = orderService.createOrderForUser(currentUser, orderRequest);

        OrderResponse response = new OrderResponse(order.getId(), "Order created successfully.");
        return ResponseEntity.ok(response);
    }

    private User getCurrentAuthenticatedUser() {
        // Get the authentication object from the SecurityContext
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("User is not authenticated");
        }

        String email;
        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        // Fetch the user from the repository using the email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @PutMapping("/{orderId}/payment")
    public ResponseEntity<?> updatePaymentMethod(
            @PathVariable UUID orderId,
            @RequestBody @Valid PaymentUpdateRequest paymentUpdateRequest) {

        Order updatedOrder = orderService.updatePaymentMethod(orderId, paymentUpdateRequest);
        return ResponseEntity.ok(updatedOrder);
    }
}
