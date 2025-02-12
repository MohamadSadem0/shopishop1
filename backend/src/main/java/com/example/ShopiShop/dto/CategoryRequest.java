package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CategoryRequest(
        @NotBlank(message = "Category name is required") String name,
        @NotBlank(message = "Image URL is required") String imageUrl,
        @NotNull(message = "Section ID is required") String sectionName
) {}
