package com.example.ShopiShop.dto;

import java.util.UUID;

public record StoreResponse(
        Long id,
        String name,
        String ownerName,
        String address,
        String description,
        String imageUrl,
        boolean isApproved,
        UUID sectionId,
        String sectionName
) {}
