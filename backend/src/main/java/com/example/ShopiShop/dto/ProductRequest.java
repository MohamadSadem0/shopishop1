package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductRequest(
        @NotBlank(message = "Product name is required") String name,
        @NotBlank(message = "Description is required") String description,
        @NotNull(message = "Price is required") BigDecimal price,
        @NotBlank(message = "Image URL is required") String imageUrl,
        @NotNull(message = "Category ID is required") String categoryName,
        @NotNull(message = "Store ID is required") Long storeId
) {}
