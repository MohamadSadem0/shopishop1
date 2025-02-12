package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // For example, find reviews by product
    List<Review> findByProductId(java.util.UUID productId);

    // Or find reviews by user
    List<Review> findByUserId(Long userId);
}
