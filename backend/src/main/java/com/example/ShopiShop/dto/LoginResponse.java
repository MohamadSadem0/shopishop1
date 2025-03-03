    package com.example.ShopiShop.dto;

    public record LoginResponse(
            String token,
            String username,
            String phoneNbr,
            String email,
            String photoUrl,
            String role,
            StoreDetails storeDetails
    ) {}
