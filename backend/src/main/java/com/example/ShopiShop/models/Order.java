package com.example.ShopiShop.models;

import com.example.ShopiShop.enums.OrderStatus;
import com.example.ShopiShop.enums.PaymentMethodEnum;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "orders")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    // The user who placed the order
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // List of order items (each corresponds to a product purchased)
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    // Total amount (before or after discounts, as applicable)
    @Column(nullable = false)
    private BigDecimal totalAmount;

    // New field: total price (if it is supposed to be the same as totalAmount or computed differently)
    @Column(name = "total_price", nullable = false)
    private BigDecimal totalPrice;

    // The shipping address (this could be more structured, e.g., an embeddable, if desired)
    @Column(nullable = true)
    private String shippingAddress;

    @Column(nullable = true)
    private String cityAddress;

    @Column(name = "contact")
    private String contactNbr;

    private LocalDateTime orderDate = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethodEnum paymentMethodEnum;
}
