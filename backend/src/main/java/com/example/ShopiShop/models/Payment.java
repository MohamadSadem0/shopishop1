package com.example.ShopiShop.models;

import com.example.ShopiShop.enums.PaymentMethodEnum;
import com.example.ShopiShop.enums.PaymentStatusEnum;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Payment amount
    @Column(name = "amount")
    private BigDecimal amount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // Payment method as enum
    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method")
    private PaymentMethodEnum paymentMethod;

    // Payment status (this can be an enum or a free-form String, as needed)
    @Column(name = "payment_status")
    private PaymentStatusEnum paymentStatus;

    // Optional: Transaction ID from the payment gateway
    @Column(name = "transaction_id")
    private String transactionId;

    private LocalDateTime paidAt;

}
