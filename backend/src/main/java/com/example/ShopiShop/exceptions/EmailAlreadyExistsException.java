package com.example.ShopiShop.exceptions;

public final class EmailAlreadyExistsException extends CustomException {
    public EmailAlreadyExistsException() {
        super("Email is already in use");
    }
}
