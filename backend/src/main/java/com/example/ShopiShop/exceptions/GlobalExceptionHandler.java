package com.example.ShopiShop.exceptions;

import com.example.ShopiShop.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        // Use ex.getReason() if available; otherwise fallback to ex.getMessage()
        String errorMessage = ex.getReason();
        if (errorMessage == null || errorMessage.trim().isEmpty()) {
            errorMessage = ex.getMessage();
        }
        ApiResponse<Object> response = new ApiResponse<>(false, errorMessage, null);
        return ResponseEntity.status(ex.getStatusCode()).body(response);
    }
    @ExceptionHandler(RessourceAlreadyExistException.class)
    public ResponseEntity<ApiResponse<Object>> handleRessourceAlreadyExistException(RessourceAlreadyExistException ex) {
        ApiResponse<Object> response = new ApiResponse<>(false, ex.getMessage(), null);
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneralException(Exception ex) {
        ApiResponse<Object> response = new ApiResponse<>(false, "An unexpected error occurred", null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }



}
