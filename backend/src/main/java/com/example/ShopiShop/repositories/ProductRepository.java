package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {

    // Auto-generated queries (clean and simple)
    Optional<Product> findById(UUID id);
    Optional<Product> findByName(String name);
    Page<Product> findAll(Pageable pageable);
    List<Product> findByStoreId(Long storeId);
    Page<Product> findByStoreId(Long storeId, Pageable pageable);
    List<Product> findByCategoryId(UUID categoryId);
    Page<Product> findByCategoryName(String categoryName, Pageable pageable);
    List<Product> findTop5ByOrderByTotalSellDesc();
    List<Product> findTop10ByOrderByTotalSellDesc();
    Page<Product> findAllByOrderByTotalSellDesc(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.discountActive = true AND " +
            "(p.discountStartDate IS NULL OR p.discountStartDate <= CURRENT_DATE) AND " +
            "(p.discountEndDate IS NULL OR p.discountEndDate >= CURRENT_DATE)")
    List<Product> findActiveDiscountProducts();

    @Query("SELECT p FROM Product p WHERE p.discountActive = true AND p.discountPrice IS NOT NULL " +
            "ORDER BY (p.price - p.discountPrice) DESC LIMIT 10")
    List<Product> findTopDiscountProducts();

    List<Product> findByDiscountActiveTrue();

    List<Product> findByStoreIdAndDiscountActiveTrueAndDiscountEndDateBefore(
            Long storeId,
            LocalDate endDate
    );


    // Add to ProductRepository.java
    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR p.category.name = :category) AND " +
            "(:lastSeenId IS NULL OR p.id < :lastSeenId) AND " +
            "(:lastSeenDate IS NULL OR p.createdAt < :lastSeenDate) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    List<Product> findNextPage(
            @Param("category") String category,
            @Param("lastSeenId") UUID lastSeenId,
            @Param("lastSeenDate") LocalDateTime lastSeenDate,
            Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId ORDER BY p.createdAt DESC, p.id DESC")
    Page<Product> findByStoreIdFirstPage(
            @Param("storeId") Long storeId,
            Pageable pageable);

    // For cursor-based pagination
    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND " +
            "(p.createdAt < :cursorDate OR (p.createdAt = :cursorDate AND p.id < :cursorId)) " +
            "ORDER BY p.createdAt DESC, p.id DESC")
    Page<Product> findByStoreIdAfterCursor(
            @Param("storeId") Long storeId,
            @Param("cursorId") UUID cursorId,
            @Param("cursorDate") LocalDateTime cursorDate,
            Pageable pageable);

    // Count query for pagination
    @Query("SELECT COUNT(p) FROM Product p WHERE p.store.id = :storeId")
    long countByStoreId(@Param("storeId") Long storeId);
}