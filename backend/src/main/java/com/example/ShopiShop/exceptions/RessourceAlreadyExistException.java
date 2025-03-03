package com.example.ShopiShop.exceptions;

public class RessourceAlreadyExistException extends RuntimeException {
    public RessourceAlreadyExistException(String resourceName) {
        super(resourceName + " already exists.");
    }
}
