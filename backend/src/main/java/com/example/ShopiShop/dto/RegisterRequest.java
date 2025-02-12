package com.example.ShopiShop.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Invalid email format") @NotBlank(message = "Email is required") String email,
        @NotBlank(message = "Password is required") String password,
        String profilePictureUrl
) {}
