package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.AuthenticationRequest;
import com.example.ShopiShop.dto.RegisterRequest;
import com.example.ShopiShop.service.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/public/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        Map<String, Object> authResponse = authenticationService.authenticate(request);
        return ResponseEntity.ok(authResponse);
    }
}
