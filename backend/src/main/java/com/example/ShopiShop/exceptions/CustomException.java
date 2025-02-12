package com.example.ShopiShop.exceptions;

public sealed class CustomException extends RuntimeException permits EmailAlreadyExistsException, InvalidCredentialsException {
    public CustomException(String message) {
        super(message);
    }
}

