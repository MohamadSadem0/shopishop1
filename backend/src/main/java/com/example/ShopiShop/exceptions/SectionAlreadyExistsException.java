package com.example.ShopiShop.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class SectionAlreadyExistsException extends RuntimeException {
    public SectionAlreadyExistsException() {
        super("Section with this name already exists.");
    }
}
