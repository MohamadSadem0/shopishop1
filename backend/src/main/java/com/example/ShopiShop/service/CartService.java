package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.CartItemRequest;
import com.example.ShopiShop.dto.CartItemResponse;
import com.example.ShopiShop.models.CartItem;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.CartItemRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartItemRepository cartItemRepository, UserRepository userRepository, ProductRepository productRepository) {
        this.cartItemRepository = cartItemRepository;
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
                        cartItem.getProduct().getEffectivePrice(),
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

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem cartItem = cartItemRepository.findByUser(user)
                .stream()
                .filter(item -> item.getProduct().getId().equals(request.productId()))
                .findFirst()
                .orElse(null);

        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
        } else {
            cartItem.setQuantity(cartItem.getQuantity() + request.quantity());
        }

        CartItem savedCartItem = cartItemRepository.save(cartItem);

        return new CartItemResponse(
                savedCartItem.getId(),
                savedCartItem.getProduct().getName(),
                savedCartItem.getProduct().getId(),

                savedCartItem.getProduct().getImageUrl(),
                savedCartItem.getProduct().getPrice(),
                savedCartItem.getQuantity()
        );
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
