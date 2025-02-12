package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.CouponRequest;
import com.example.ShopiShop.dto.CouponResponse;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.Coupon;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.repositories.CouponRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CouponService {

    private final CouponRepository couponRepository;
    private final StoreRepository storeRepository;

    /**
     * Create a new coupon for a store (or site-wide if storeId is null).
     */
    public CouponResponse createCoupon(CouponRequest request) {
        // If the coupon code is already taken, handle it (optional).
        if (couponRepository.findByCode(request.code()).isPresent()) {
            throw new IllegalArgumentException("Coupon code already in use");
        }

        // If storeId is provided, validate store existence
        Store store = null;
        if (request.storeId() != null) {
            store = storeRepository.findById(request.storeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        }

        Coupon coupon = Coupon.builder()
                .code(request.code())
                .discountPercent(request.discountPercent())
                .discountAmount(request.discountAmount())
                .usageLimit(request.usageLimit())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .isActive(request.isActive() != null ? request.isActive() : true)
                .store(store) // link to store if present
                .build();

        Coupon saved = couponRepository.save(coupon);
        return mapToResponse(saved);
    }

    /**
     * Get a coupon by its ID
     */
    public CouponResponse getCouponById(Long couponId) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + couponId));
        return mapToResponse(coupon);
    }

    /**
     * Get all coupons for a given store, or all coupons if storeId is null
     */
    public List<CouponResponse> getCouponsForStore(Long storeId) {
        if (storeId == null) {
            // Return all coupons (site-wide + store-specific)
            return couponRepository.findAll().stream()
                    .map(this::mapToResponse)
                    .toList();
        } else {
            // Check store existence
            storeRepository.findById(storeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            // Filter by store (handy to have a findByStoreId() if you want)
            return couponRepository.findAll().stream()
                    .filter(c -> c.getStore() != null && c.getStore().getId().equals(storeId))
                    .map(this::mapToResponse)
                    .toList();
        }
    }

    /**
     * Update an existing coupon (merchant can update discount, dates, etc.)
     */
    public CouponResponse updateCoupon(Long couponId, CouponRequest request) {
        Coupon coupon = couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with ID: " + couponId));

        // If storeId is provided, re-link to store
        if (request.storeId() != null) {
            Store store = storeRepository.findById(request.storeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
            coupon.setStore(store);
        }

        // Update fields if they are not null
        if (request.code() != null) coupon.setCode(request.code());
        if (request.discountPercent() != null) coupon.setDiscountPercent(request.discountPercent());
        if (request.discountAmount() != null) coupon.setDiscountAmount(request.discountAmount());
        if (request.usageLimit() != null) coupon.setUsageLimit(request.usageLimit());
        if (request.startDate() != null) coupon.setStartDate(request.startDate());
        if (request.endDate() != null) coupon.setEndDate(request.endDate());
        if (request.isActive() != null) coupon.setIsActive(request.isActive());

        Coupon updated = couponRepository.save(coupon);
        return mapToResponse(updated);
    }

    /**
     * Delete or deactivate a coupon
     */
    public void deleteCoupon(Long couponId) {
        if (!couponRepository.existsById(couponId)) {
            throw new ResourceNotFoundException("Coupon not found with ID: " + couponId);
        }
        couponRepository.deleteById(couponId);
    }

    /**
     * Find a coupon by code (e.g. "SUMMER2025"), often used at checkout.
     */
    public CouponResponse findByCode(String code) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Coupon not found with code: " + code));
        return mapToResponse(coupon);
    }

    /**
     * Example of applying a coupon at checkout.
     * This method just checks validity; you'd do the final discount math
     * in your Cart/Order logic.
     */
    public boolean validateCoupon(String code) {
        Optional<Coupon> couponOpt = couponRepository.findByCode(code);
        if (couponOpt.isEmpty()) {
            return false;
        }

        Coupon coupon = couponOpt.get();

        // Check if active
        if (!Boolean.TRUE.equals(coupon.getIsActive())) {
            return false;
        }
        // Check usage limit
        if (coupon.getUsageLimit() != null && coupon.getUsedCount() >= coupon.getUsageLimit()) {
            return false;
        }
        // Check date range
        LocalDate now = LocalDate.now();
        if (coupon.getStartDate() != null && now.isBefore(coupon.getStartDate())) {
            return false;
        }
        if (coupon.getEndDate() != null && now.isAfter(coupon.getEndDate())) {
            return false;
        }

        return true;
    }

    /**
     * Called after successfully applying a coupon to an order, to increment usage.
     */
    public void incrementCouponUsage(String code) {
        couponRepository.findByCode(code).ifPresent(coupon -> {
            if (coupon.getUsageLimit() != null) {
                coupon.setUsedCount(coupon.getUsedCount() + 1);
                couponRepository.save(coupon);
            }
        });
    }

    private CouponResponse mapToResponse(Coupon coupon) {
        return new CouponResponse(
                coupon.getId(),
                coupon.getCode(),
                coupon.getDiscountPercent(),
                coupon.getDiscountAmount(),
                coupon.getUsageLimit(),
                coupon.getUsedCount(),
                coupon.getStartDate(),
                coupon.getEndDate(),
                coupon.getIsActive(),
                coupon.getStore() == null ? null : coupon.getStore().getId()
        );
    }
}
