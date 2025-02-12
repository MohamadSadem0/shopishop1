    package com.example.ShopiShop.dto;

    import java.util.UUID;

    public record SectionResponse(
            UUID id,
            String name,
            String imageUrl
    ) {}
