package com.example.ShopiShop.models;

import com.example.ShopiShop.enums.DiscountType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "product", indexes = {
        @Index(name = "idx_product_discount_active", columnList = "discountActive"),
        @Index(name = "idx_product_discount_dates", columnList = "discountStartDate,discountEndDate")
})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "description", columnDefinition = "TEXT", nullable = false)
    private String description;

    @Column(name = "price", nullable = false, precision = 19, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    @Column(name = "image", nullable = false)
    private String imageUrl;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Review> reviews;

    @Version
    @Column(nullable = false)
    private Integer version = 0;

    @Column(nullable = false)
    private Boolean isAvailable = false;

    @Column(nullable = false)
    private Integer totalSell = 0;

    @Column(name = "time_created")
    @CreationTimestamp
    private Timestamp createdAt;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    @Column(precision = 19, scale = 2)
    private BigDecimal discountValue = BigDecimal.ZERO;

    @Column(precision = 19, scale = 2)
    private BigDecimal discountPrice = BigDecimal.ZERO;

    private LocalDate discountStartDate;
    private LocalDate discountEndDate;
    private String discountName;

    @Column(nullable = false)
    private Boolean discountActive = false;

    private Integer discountMinQuantity = 1;

    // Add these methods to your Product entity
    public boolean isDiscountCurrentlyActive() {
        if (!discountActive) return false;

        LocalDate now = LocalDate.now();
        boolean started = discountStartDate == null || !now.isBefore(discountStartDate);
        boolean notEnded = discountEndDate == null || !now.isAfter(discountEndDate);
        return started && notEnded;
    }

    // In Product entity

    public BigDecimal calculateCurrentPrice() {
        return isDiscountCurrentlyActive() ?
                (discountPrice != null ? discountPrice : calculateDiscountedPrice()) :
                price;
    }


    private BigDecimal calculateDiscountedPrice() {
        return discountType == DiscountType.PERCENTAGE ?
                price.subtract(price.multiply(discountValue).divide(BigDecimal.valueOf(100))) :
                price.subtract(discountValue);
    }
}