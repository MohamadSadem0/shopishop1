package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Order;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.models.User;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);



    // This returns orders that contain at least one order item whose product belongs to the specified store.
    List<Order> findDistinctByOrderItems_Product_Store(Store store);
    Optional<Order> findById(UUID uuid);
}
