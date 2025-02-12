package com.example.ShopiShop.dto;

import jakarta.validation.constraints.NotBlank;

import java.util.UUID;

public record StoreRequest(
        @NotBlank(message = "Store name cannot be empty") String name,
        String location,
        String imageUrl,
        String address,
        String description,
        String sectionName

) {}
