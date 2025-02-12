package com.example.ShopiShop.models;

import com.example.ShopiShop.enums.PayoutStatus;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "vendor_payout")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorPayout {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Which store/vender this payout is for
    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    // The order from which these earnings come
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;


    // Amount owed to the store for that order
    @Column(nullable = false)
    private BigDecimal amountOwed;

    // Commission taken by the platform (optional)
    private BigDecimal commissionTaken;

    // Whether the payout has been disbursed to the store
    private boolean isPaid;

    // Payout status: PENDING, PAID, etc.
    @Column(name = "payout_status")
    private String payoutStatus = "PENDING";

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;

}
