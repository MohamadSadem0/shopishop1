package com.example.ShopiShop.exceptions;

public sealed class CustomException extends RuntimeException permits InvalidCredentialsException {
    public CustomException(String message) {
        super(message);
    }
}

