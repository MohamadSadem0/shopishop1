package com.example.ShopiShop.models;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String code; // e.g. "SUMMER2025"
    private Double discountPercent;      // e.g. 15.0 for 15% off
    private BigDecimal discountAmount;   // e.g. 10.00 for $10 off
    private Integer usageLimit;          // e.g. 100 total uses
    private Integer usedCount;           // how many times used so far
    private LocalDate startDate;
    private LocalDate endDate;

    // Which store is this coupon for? Null/absent means "site-wide" if you prefer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id")
    private Store store;

    // Alternatively, you can store a relation to a Category or a Product
    // if it’s only valid for a specific category/product
    // or a separate linking table if you want multiple categories.

    // e.g. "ACTIVE" or "INACTIVE", or you can check date validity
    private Boolean isActive = true;
}
