package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.models.Order;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

    @GetMapping("/all")
    public ResponseEntity<List<UserOrderResponse>> getUserOrders() {
        User currentUser = getCurrentAuthenticatedUser();
        List<UserOrderResponse> orders = orderService.getUserOrderResponses(currentUser);
        return ResponseEntity.ok(orders);
    }

    // New endpoint: Get orders relevant to the store owned by the authenticated user.
    @GetMapping("/store")
    public ResponseEntity<List<StoreOrderResponse>> getStoreOrders() {
        User currentUser = getCurrentAuthenticatedUser();
        // Ensure the authenticated user owns a store
        if (currentUser.getStore() == null) {
            throw new RuntimeException("User does not own a store");
        }
        Store store = currentUser.getStore();
        List<StoreOrderResponse> responses = orderService.getStoreOrdersForStore(store);
        return ResponseEntity.ok(responses);
    }


    @GetMapping("/{orderId}")
    public ResponseEntity<UserOrderResponse> getOrderById(@PathVariable UUID orderId) {
        Order order = orderService.getOrderById(orderId);

        // Map OrderItems to their response DTO representation.
        List<UserOrderItemResponse> orderItems = order.getOrderItems().stream()
                .map(item -> new UserOrderItemResponse(
                        item.getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getProduct().getImageUrl()
                ))
                .collect(Collectors.toList());

        // Build the response DTO.
        UserOrderResponse response = new UserOrderResponse(
                order.getId(),
                order.getOrderDate(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getTotalPrice(),
                order.getShippingAddress(),
                order.getCityAddress(),
                orderItems
        );

        return ResponseEntity.ok(response);
    }


}
