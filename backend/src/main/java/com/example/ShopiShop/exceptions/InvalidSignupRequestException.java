package com.example.ShopiShop.exceptions;

public class InvalidSignupRequestException extends RuntimeException {
    public InvalidSignupRequestException(String message) {
        super(message);
    }
}
