package com.example.ShopiShop.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "vendor_review")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class VendorReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // The vendor (store) being reviewed
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    // The customer leaving the review
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "rating", nullable = false)
    private int rating;

    @Column(name = "comment")
    private String comment;
}
