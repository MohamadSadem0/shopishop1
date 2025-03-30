package com.example.ShopiShop.service;



import com.example.ShopiShop.dto.DiscountRequest;
import com.example.ShopiShop.enums.DiscountType;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiscountService {
    private final ProductRepository productRepository;

    @Transactional
    public Product applyDiscount(UUID productId, DiscountRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        validateDiscount(request, product.getPrice());

        product.setDiscountType(request.discountType());
        product.setDiscountValue(request.discountValue());
        product.setDiscountPrice(calculateDiscountedPrice(product.getPrice(), request));
        product.setDiscountStartDate(request.startDate());
        product.setDiscountEndDate(request.endDate());
        product.setDiscountName(request.name());
        product.setDiscountActive(true);
        product.setDiscountMinQuantity(request.minQuantity());

        return productRepository.save(product);
    }

    private BigDecimal calculateDiscountedPrice(BigDecimal originalPrice, DiscountRequest request) {
        if (request.discountedPrice() != null) {
            return request.discountedPrice();
        }

        return switch (request.discountType()) {
            case PERCENTAGE -> originalPrice.subtract(
                    originalPrice.multiply(request.discountValue().divide(BigDecimal.valueOf(100)))
            );
            case FIXED_AMOUNT -> originalPrice.subtract(request.discountValue());
        };
    }

    private void validateDiscount(DiscountRequest request, BigDecimal originalPrice) {
        if (request.discountType() ==   DiscountType.FIXED_AMOUNT &&
                request.discountValue().compareTo(originalPrice) >= 0) {
            throw new IllegalArgumentException(
                    "Fixed amount discount cannot be greater than or equal to original price"
            );
        }

        if (request.discountType() == DiscountType.PERCENTAGE &&
                request.discountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new IllegalArgumentException(
                    "Percentage discount cannot exceed 100%"
            );
        }
    }
}