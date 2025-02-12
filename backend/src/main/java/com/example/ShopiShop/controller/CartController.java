package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.CartItemRequest;
import com.example.ShopiShop.dto.CartItemResponse;
import com.example.ShopiShop.service.CartService;
import com.example.ShopiShop.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/customer/cart")
public class CartController {

    private final CartService cartService;
    private final JwtService jwtService;

    public CartController(CartService cartService, JwtService jwtService) {
        this.cartService = cartService;
        this.jwtService = jwtService;
    }

    // ✅ Extract user ID from JWT
    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("Unauthorized: No authenticated user found.");
        }
        return ((com.example.ShopiShop.models.User) authentication.getPrincipal()).getId();
    }

    // ✅ Get cart items
    @GetMapping("/all")
    public ResponseEntity<List<CartItemResponse>> getCartItems() {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity.ok(cartService.getCartItems(userId));
    }

    // ✅ Add item to cart
    @PostMapping("/add")
    public ResponseEntity<CartItemResponse> addToCart(@Valid @RequestBody CartItemRequest request) {
        Long userId = getAuthenticatedUserId();
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    // ✅ Remove item from cart
    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeCartItem(@PathVariable UUID productId) {
        Long userId = getAuthenticatedUserId();
        cartService.removeCartItem(userId, productId);
        return ResponseEntity.noContent().build();
    }

    // ✅ Clear entire cart
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        Long userId = getAuthenticatedUserId();
        cartService.clearCart(userId);
        return ResponseEntity.noContent().build();
    }
}
