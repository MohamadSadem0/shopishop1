package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Product name is required") String name,
        @NotBlank(message = "Description is required") String description,
        @NotNull(message = "Price is required") BigDecimal price,
        @NotBlank(message = "Image URL is required") String imageUrl,
        @NotNull(message = "Category ID is required") String categoryName,
        @NotNull(message = "Store ID is required") Long storeId,
        @NotNull(message = "Quantity is required")
        @PositiveOrZero(message = "Quantity must be zero or positive")
        Integer quantity
) {
    // Default constructor with quantity = 1
    public ProductRequest {
        if (quantity == null) {
            quantity = 1; // Default value
        }
    }

    // Constructor without quantity parameter (will use default value)
    public ProductRequest(String name, String description, BigDecimal price,
                          String imageUrl, String categoryName, Long storeId) {
        this(name, description, price, imageUrl, categoryName, storeId, 1);
    }
}