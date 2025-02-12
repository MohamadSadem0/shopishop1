package com.example.ShopiShop.exceptions;

public final class InvalidCredentialsException extends CustomException {
    public InvalidCredentialsException() {
        super("Invalid email or password");
    }
}
