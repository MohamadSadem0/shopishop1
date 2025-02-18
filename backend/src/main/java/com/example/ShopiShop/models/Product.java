package com.example.ShopiShop.models;


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
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "description", nullable = false)
    private String description;


    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "image", nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", referencedColumnName = "id", nullable = false)
    private Store store;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @OneToMany(mappedBy = "product", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Review> reviews;

    private Boolean isAvailable =false;
    // Tracks how many times the product has been sold
    private Integer totalSell = 0;

    // Basic discount fields
    private BigDecimal discountPrice; // e.g. 79.99 -> discounted price from 100
    private Double discountPercent;   // e.g. 20.0 means 20% off

    private LocalDate discountStartDate;
    private LocalDate discountEndDate;

    @Column(name = "time_created")
    @CreationTimestamp
    private Timestamp createdAt;


    public BigDecimal getEffectivePrice() {
        LocalDate now = LocalDate.now();
        if (discountStartDate != null && discountEndDate != null
                && now.isAfter(discountStartDate.minusDays(1))
                && now.isBefore(discountEndDate.plusDays(1))) {

            // If discountPrice is set, return that
            if (discountPrice != null) {
                return discountPrice;
            }

            // Else use discountPercent
            if (discountPercent != null && discountPercent > 0) {
                BigDecimal discount = price.multiply(BigDecimal.valueOf(discountPercent / 100.0));
                return price.subtract(discount);
            }
        }
        return price;
    }
}

