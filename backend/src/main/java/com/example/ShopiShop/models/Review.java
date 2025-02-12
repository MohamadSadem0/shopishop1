package com.example.ShopiShop.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Rating out of 5, for example
    @Column(nullable = false)
    private int rating;

    // A text comment for the review
    @Column(nullable = false)
    private String comment;

    // The user who made the review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // The product being reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // Timestamps
    private LocalDateTime createdAt = LocalDateTime.now();
}
