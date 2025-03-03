package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/public/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        // Exceptions are handled globally via GlobalExceptionHandler
        String message = authenticationService.register(request);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

//    @PostMapping("/login")
//    public ResponseEntity<LoginResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
//        LoginResponse authResponse = authenticationService.authenticate(request);
//        return ResponseEntity.ok(authResponse);
//    }



    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse> >authenticate(@Valid @RequestBody AuthenticationRequest request) {
        // Exceptions are handled globally via GlobalExceptionHandler
       LoginResponse authResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Login successful", authResponse));
    }

    @GetMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirmAccount(@RequestParam("token") String token) {
        // Exceptions are handled globally via GlobalExceptionHandler
        String message = authenticationService.confirmAccount(token);
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String message = authenticationService.requestPasswordReset(request.email());
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    // Endpoint to reset password using the token from email
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody ResetPasswordDTO request) {
        String message = authenticationService.resetPassword(request.token(), request.newPassword());
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    // Endpoint for authenticated users to update password using old and new password
    @PostMapping("/update-password")
    public ResponseEntity<ApiResponse<String>> updatePassword(@Valid @RequestBody UpdatePasswordDTO request) {
        // Retrieve the email from the security context (user is already authenticated)
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        String message = authenticationService.updatePassword(email, request.oldPassword(), request.newPassword());
        return ResponseEntity.ok(new ApiResponse<>(true, message, null));
    }

    @GetMapping("/verify-reset-token")
    public ResponseEntity<ApiResponse<String>> verifyResetToken(@RequestParam("token") String token) {
        Optional<User> userOpt = userRepository.findByResetPasswordToken(token);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(false, "Invalid or expired token", null));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Token is valid", null));
    }


}
