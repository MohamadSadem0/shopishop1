package com.example.ShopiShop.service;

import com.example.ShopiShop.enums.DiscountType;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.repositories.ProductRepository;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class DiscountService {
    private final ProductRepository productRepository;

    // Cache for active discounts (productId -> effectivePrice)
    private final Cache<UUID, BigDecimal> discountCache =
            Caffeine.newBuilder()
                    .expireAfterWrite(1, TimeUnit.HOURS)
                    .maximumSize(1000)
                    .build();

    /**
     * Calculates the effective price considering active discounts
     */
    public BigDecimal calculateEffectivePrice(Product product) {
        // Check cache first
        BigDecimal cachedPrice = discountCache.getIfPresent(product.getId());
        if (cachedPrice != null) {
            return cachedPrice;
        }

        // If no active discount or dates invalid, return regular price
        if (!isDiscountApplicable(product)) {
            return product.getPrice();
        }

        // Calculate discount price
        BigDecimal effectivePrice = calculateDiscountedPrice(product);

        // Cache the result
        discountCache.put(product.getId(), effectivePrice);

        return effectivePrice;
    }

    /**
     * Checks if discount should be applied to a product
     */
    public boolean isDiscountApplicable(Product product) {
        if (!product.getDiscountActive() || product.getDiscountPrice() == null) {
            return false;
        }

        LocalDate now = LocalDate.now();
        boolean isDateValid = (product.getDiscountStartDate() == null || !now.isBefore(product.getDiscountStartDate())) &&
                (product.getDiscountEndDate() == null || !now.isAfter(product.getDiscountEndDate()));

        return isDateValid && product.getQuantity() >= product.getDiscountMinQuantity();
    }

    /**
     * Calculates the discounted price based on discount type
     */
    public BigDecimal calculateDiscountedPrice(Product product) {
        if (product.getDiscountType() == DiscountType.PERCENTAGE) {
            BigDecimal discountAmount = product.getPrice()
                    .multiply(product.getDiscountValue())
                    .divide(BigDecimal.valueOf(100));
            return product.getPrice().subtract(discountAmount).max(BigDecimal.ZERO);
        } else {
            // Fixed amount discount
            return product.getPrice().subtract(product.getDiscountValue()).max(BigDecimal.ZERO);
        }
    }

    /**
     * Scheduled job to update discount statuses
     */
    @Scheduled(cron = "0 0 * * * *") // Run every hour
    public void updateDiscountStatuses() {
        LocalDate now = LocalDate.now();
        List<Product> productsWithDiscounts = productRepository.findByDiscountActiveTrue();

        productsWithDiscounts.forEach(product -> {
            boolean shouldBeActive = (product.getDiscountStartDate() == null || !now.isBefore(product.getDiscountStartDate())) &&
                    (product.getDiscountEndDate() == null || !now.isAfter(product.getDiscountEndDate()));

            if (product.getDiscountActive() != shouldBeActive) {
                product.setDiscountActive(shouldBeActive);
                productRepository.save(product);
                discountCache.invalidate(product.getId());
            }
        });
    }

    /**
     * Clears discount cache for a specific product
     */
    public void clearDiscountCache(UUID productId) {
        discountCache.invalidate(productId);
    }

    public Map<UUID, BigDecimal> calculateBulkEffectivePrices(List<Product> products) {
        Map<UUID, BigDecimal> results = new HashMap<>();
        LocalDate now = LocalDate.now();

        products.forEach(product -> {
            // Check cache first
            BigDecimal cachedPrice = discountCache.getIfPresent(product.getId());
            if (cachedPrice != null) {
                results.put(product.getId(), cachedPrice);
                return;
            }

            // Calculate fresh price
            BigDecimal effectivePrice = product.getPrice();

            if (product.getDiscountActive() &&
                    product.getDiscountPrice() != null &&
                    (product.getDiscountStartDate() == null || !now.isBefore(product.getDiscountStartDate())) &&
                    (product.getDiscountEndDate() == null || !now.isAfter(product.getDiscountEndDate()))) {

                effectivePrice = calculateDiscountedPrice(product);
                discountCache.put(product.getId(), effectivePrice);
            }

            results.put(product.getId(), effectivePrice);
        });

        return results;
    }
}