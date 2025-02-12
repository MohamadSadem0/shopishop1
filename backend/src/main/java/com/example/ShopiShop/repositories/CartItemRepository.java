package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.CartItem;
import com.example.ShopiShop.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    void deleteByUserAndProductId(User user, UUID productId);
}
