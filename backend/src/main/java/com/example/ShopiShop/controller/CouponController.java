package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.ApiResponse;
import com.example.ShopiShop.dto.CouponRequest;
import com.example.ShopiShop.dto.CouponResponse;
import com.example.ShopiShop.service.CouponService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/merchant/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<CouponResponse>> createCoupon(@Valid @RequestBody CouponRequest request) {
        CouponResponse created = couponService.createCoupon(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coupon created", created));
    }

    @GetMapping("/{couponId}")
    public ResponseEntity<ApiResponse<CouponResponse>> getCouponById(@PathVariable Long couponId) {
        CouponResponse coupon = couponService.getCouponById(couponId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coupon found", coupon));
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<ApiResponse<List<CouponResponse>>> getCouponsByStore(@PathVariable Long storeId) {
        List<CouponResponse> coupons = couponService.getCouponsForStore(storeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coupons for store " + storeId, coupons));
    }

    @PutMapping("/update/{couponId}")
    public ResponseEntity<ApiResponse<CouponResponse>> updateCoupon(
            @PathVariable Long couponId,
            @Valid @RequestBody CouponRequest request) {
        CouponResponse updated = couponService.updateCoupon(couponId, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coupon updated", updated));
    }

    @DeleteMapping("/delete/{couponId}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long couponId) {
        couponService.deleteCoupon(couponId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Coupon deleted", null));
    }

    // Additional endpoints as needed...
}
