package com.example.ShopiShop.exceptions;

public class DuplicateEntityException extends RuntimeException {
    public DuplicateEntityException(String entity, String field, String value) {
        super(String.format("A %s with the %s '%s' already exists.", entity, field, value));
    }

    public DuplicateEntityException(String entity) {
    }
}