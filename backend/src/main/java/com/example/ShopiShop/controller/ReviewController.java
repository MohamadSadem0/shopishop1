package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.ReviewRequest;
import com.example.ShopiShop.dto.ReviewResponse;
import com.example.ShopiShop.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("customer/reviews")
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse createReview(@RequestBody ReviewRequest request) {
        return reviewService.createReview(request);
    }

    @GetMapping("public/reviews/product/{productId}")
    public List<ReviewResponse> getReviewsByProductId(@PathVariable UUID productId) {
        return reviewService.getReviewsByProductId(productId);
    }

    @GetMapping("public/reviews/user/{userId}")
    public List<ReviewResponse> getReviewsByUserId(@PathVariable Long userId) {
        return reviewService.getReviewsByUserId(userId);
    }

    @DeleteMapping("public/reviews/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
    }
}
