package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.ReviewRequest;
import com.example.ShopiShop.dto.ReviewResponse;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.models.Review;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.ReviewRepository;
import com.example.ShopiShop.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewResponse createReview(ReviewRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        User user = userRepository.findById(request.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Build Review
        Review review = Review.builder()
                .product(product)
                .user(user)
                .rating(request.rating())
                .comment(request.comment())
                .build();

        Review savedReview = reviewRepository.save(review);

        return mapToResponse(savedReview);
    }

    public List<ReviewResponse> getReviewsByProductId(java.util.UUID productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return reviews.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ReviewResponse> getReviewsByUserId(Long userId) {
        List<Review> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found");
        }
        reviewRepository.deleteById(reviewId);
    }

    // Helper
    private ReviewResponse mapToResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getProduct().getName(),
                review.getCreatedAt()
        );
    }
}
