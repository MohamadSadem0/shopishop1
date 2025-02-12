package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Coupon;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    // Finds a coupon by its code (e.g. "SPRING20")
    Optional<Coupon> findByCode(String code);
}
