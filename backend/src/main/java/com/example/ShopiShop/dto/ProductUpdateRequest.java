package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record ProductUpdateRequest(
        @NotBlank(message = "Product name is required") String name,
        @NotBlank(message = "Description is required") String description,
        @NotNull(message = "Price is required") BigDecimal price,
        @NotBlank(message = "Image URL is required") String imageUrl
) {}
