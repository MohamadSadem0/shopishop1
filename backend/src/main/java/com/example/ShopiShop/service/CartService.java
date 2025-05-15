package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.CartItemRequest;
import com.example.ShopiShop.dto.CartItemResponse;
import com.example.ShopiShop.exceptions.InsufficientStockException;
import com.example.ShopiShop.models.CartItem;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.CartItemRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.UserRepository;
import jakarta.persistence.OptimisticLockException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final DiscountService discountService;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, DiscountService discountService, UserRepository userRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
        this.discountService = discountService;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    // ✅ Get authenticated user
    private User getAuthenticatedUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // ✅ Fetch cart items for authenticated user
    public List<CartItemResponse> getCartItems(Long userId) {
        User user = getAuthenticatedUser();
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot access another user's cart.");
        }

        return cartItemRepository.findByUser(user)
                .stream()
                .map(cartItem -> new CartItemResponse(
                        cartItem.getId(),
                        cartItem.getProduct().getName(),
                        cartItem.getProduct().getId(),
                        cartItem.getProduct().getImageUrl(),
                        discountService.calculateEffectivePrice(cartItem.getProduct()),
                        cartItem.getQuantity()
                ))
                .toList();
    }

    // ✅ Add item to cart for authenticated user
    @Transactional
    public CartItemResponse addToCart(Long userId, CartItemRequest request) {
        User user = getAuthenticatedUser();
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot modify another user's cart.");
        }

        // Fetch the latest product details (with optimistic locking)
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Retrieve any existing cart item for this product
        CartItem cartItem = cartItemRepository.findByUser(user)
                .stream()
                .filter(item -> item.getProduct().getId().equals(request.productId()))
                .findFirst()
                .orElse(null);

        // Calculate the new total quantity for this product in the cart
        int newQuantity = request.quantity();
        if (cartItem != null) {
            newQuantity += cartItem.getQuantity();
        }

        // Validate available stock
        if (newQuantity > product.getQuantity()) {
            throw new InsufficientStockException("Insufficient stock for product: " + product.getName());
        }

        // Create or update the cart item accordingly
        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
        } else {
            cartItem.setQuantity(newQuantity);
        }

        try {
            CartItem savedCartItem = cartItemRepository.save(cartItem);
            return new CartItemResponse(
                    savedCartItem.getId(),
                    savedCartItem.getProduct().getName(),
                    savedCartItem.getProduct().getId(),
                    savedCartItem.getProduct().getImageUrl(),
                    savedCartItem.getProduct().getPrice(),
                    savedCartItem.getQuantity()
            );
        } catch (OptimisticLockException e) {
            throw new RuntimeException("Concurrent update error. Please try again.");
        }
    }


    // ✅ Remove item from cart
    @Transactional
    public void removeCartItem(Long userId, UUID productId) {
        User user = getAuthenticatedUser();
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot modify another user's cart.");
        }
        cartItemRepository.deleteByUserAndProductId(user, productId);
    }

    // ✅ Clear entire cart
    @Transactional
    public void clearCart(Long userId) {
        User user = getAuthenticatedUser();
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized: You cannot modify another user's cart.");
        }
        List<CartItem> cartItems = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(cartItems);
    }
}
