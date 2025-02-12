package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.StoreRequest;
import com.example.ShopiShop.dto.StoreResponse;
import com.example.ShopiShop.exceptions.CustomException;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;
    private final UserRepository userRepository;


    @PostMapping("customer/store/create")
    public ResponseEntity<Map<String, Object>> createStore(
            @Valid @RequestBody StoreRequest request,
            Authentication authentication
    ) {
        // 🔹 Find the user by email (extracted from JWT token)
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new CustomException("User not found"));

        // Call store creation service
        StoreResponse storeResponse = storeService.createStore(user.getId(), request);

        return ResponseEntity.ok(Map.of(
                "message", "Store created successfully",
                "store", storeResponse
        ));
    }

}
