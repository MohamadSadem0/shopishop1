package com.example.ShopiShop.dto;

import java.util.List;
import java.util.UUID;

public record SectionWithCategoriesResponse(
        UUID id,
        String name,
        String imageUrl,
        List<CategoryResponse> categories
) {}
