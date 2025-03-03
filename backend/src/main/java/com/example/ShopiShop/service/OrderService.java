package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.dto.StockUpdate; // Ensure this is defined with productId and quantity fields
import com.example.ShopiShop.enums.OrderStatus;
import com.example.ShopiShop.exceptions.InsufficientStockException;
import com.example.ShopiShop.models.*;
import com.example.ShopiShop.repositories.OrderRepository;
import com.example.ShopiShop.repositories.CartItemRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import jakarta.persistence.OptimisticLockException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, CartItemRepository cartItemRepository, SimpMessagingTemplate messagingTemplate) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.cartItemRepository = cartItemRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @Transactional
    public Order createOrderForUser(User user, OrderRequest orderRequest) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cartItems) {
            // Re-fetch product to get the latest stock with version info (if needed)
            Product product = cartItem.getProduct();

            int orderQuantity = cartItem.getQuantity();
            if (orderQuantity > product.getQuantity()) {
                throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
            }

            // Deduct the stock
            product.setQuantity(product.getQuantity() - orderQuantity);
            // Save the product update to trigger version check and persist the new quantity
            try {
                productRepository.save(product);
                // Publish stock update via WebSocket to notify clients in real time
                messagingTemplate.convertAndSend(
                        "/topic/stockUpdates",
                        new StockUpdate(product.getId(), product.getQuantity())
                );
            } catch (OptimisticLockException e) {
                throw new RuntimeException("Product " + product.getName() + " was updated by another transaction. Please try again.");
            }

            OrderItem orderItem = OrderItem.builder()
                    .product(product)
                    .quantity(orderQuantity)
                    .price(product.getEffectivePrice())
                    .build();
            orderItems.add(orderItem);
        }

        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .user(user)
                .orderItems(orderItems)
                .totalAmount(totalAmount)
                .totalPrice(totalAmount)
                .shippingAddress(orderRequest.shippingAddress())
                .cityAddress(orderRequest.city())
                .contactNbr(orderRequest.contactNumber())
                .orderDate(LocalDateTime.now())
                .status(OrderStatus.PENDING)
                .build();

        orderItems.forEach(item -> item.setOrder(order));
        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    @Transactional
    public Order updatePaymentMethod(UUID orderId, PaymentUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setPaymentMethodEnum(request.paymentMethod());
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(User user) {
        return orderRepository.findByUser(user);
    }

    public List<UserOrderResponse> getUserOrderResponses(User user) {
        List<Order> orders = getOrdersByUser(user);
        return orders.stream().map(order -> {
            List<UserOrderItemResponse> orderItems = order.getOrderItems().stream()
                    .map(item -> new UserOrderItemResponse(
                            item.getId(),
                            item.getProduct().getName(),
                            item.getQuantity(),
                            item.getPrice(),
                            item.getProduct().getImageUrl()
                    ))
                    .collect(Collectors.toList());
            return new UserOrderResponse(
                    order.getId(),
                    order.getOrderDate(),
                    order.getStatus(),
                    order.getTotalAmount(),
                    order.getTotalPrice(),
                    order.getShippingAddress(),
                    order.getCityAddress(),
                    orderItems
            );
        }).collect(Collectors.toList());
    }

    public List<StoreOrderResponse> getStoreOrdersForStore(Store store) {
        List<Order> orders = orderRepository.findDistinctByOrderItems_Product_Store(store);
        return orders.stream()
                .map(order -> {
                    List<StoreOrderItemResponse> storeItems = order.getOrderItems().stream()
                            .filter(item -> item.getProduct().getStore().equals(store))
                            .map(item -> new StoreOrderItemResponse(
                                    item.getId(),
                                    item.getProduct().getName(),
                                    item.getQuantity(),
                                    item.getPrice(),
                                    item.getProduct().getImageUrl()
                            ))
                            .collect(Collectors.toList());

                    return new StoreOrderResponse(
                            order.getId(),
                            order.getOrderDate(),
                            order.getStatus(),
                            storeItems
                    );
                })
                .collect(Collectors.toList());
    }

    public Order getOrderById(UUID orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
