package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;

public record SectionRequest(
        @NotBlank(message = "Name is required") String name,
        String imageUrl
) {}
