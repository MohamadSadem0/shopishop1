package com.example.ShopiShop.dto;

import java.util.UUID;

public record CategoryResponse(
        UUID id,
        String name,
        String imageUrl,
        UUID sectionId
) {}
