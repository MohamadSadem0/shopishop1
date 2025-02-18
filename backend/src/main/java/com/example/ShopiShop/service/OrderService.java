package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.OrderRequest;
import com.example.ShopiShop.dto.PaymentUpdateRequest;
import com.example.ShopiShop.enums.OrderStatus;
import com.example.ShopiShop.models.*;
import com.example.ShopiShop.repositories.OrderRepository;
import com.example.ShopiShop.repositories.CartItemRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;

    public OrderService(OrderRepository orderRepository, CartItemRepository cartItemRepository) {
        this.orderRepository = orderRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @Transactional
    public Order createOrderForUser(User user, OrderRequest orderRequest) {
        // Fetch cart items for the user
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Map each CartItem to an OrderItem
        List<OrderItem> orderItems = cartItems.stream().map(    cartItem ->
                OrderItem.builder()
                        .product(cartItem.getProduct())
                        .quantity(cartItem.getQuantity())
                        .price(cartItem.getProduct().getEffectivePrice())
                        .build()
        ).collect(Collectors.toList());

        // Calculate the total amount for the order
// Calculate the total amount for the order
        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

// Create the Order and set totalPrice
        Order order = Order.builder()
                .user(user)
                .orderItems(orderItems)
                .totalAmount(totalAmount)
                .totalPrice(totalAmount) // <-- Set totalPrice here
                .shippingAddress(orderRequest.shippingAddress())
                .cityAddress(orderRequest.city())
                .contactNbr(orderRequest.contactNumber())
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)

                .build();

// Set the order reference in each OrderItem
        orderItems.forEach(item -> item.setOrder(order));

// Persist the order (cascade saves the items)
        Order savedOrder = orderRepository.save(order);

// Clear the user's cart after the order is placed
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;

    }



    @Transactional
    public Order updatePaymentMethod(UUID orderId, PaymentUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentMethodEnum(request.paymentMethod());
        // Optionally, update order status based on payment success, etc.
        return orderRepository.save(order);
    }
}
