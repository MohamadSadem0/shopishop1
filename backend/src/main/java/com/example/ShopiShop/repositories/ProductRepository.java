package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
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

    // Custom queries only where needed
    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    Page<Product> searchByNameIgnoreCase(@Param("name") String name, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "(p.discountPrice IS NOT NULL) AND " +
            "(p.discountStartDate <= CURRENT_DATE OR p.discountStartDate IS NULL) AND " +
            "(p.discountEndDate >= CURRENT_DATE OR p.discountEndDate IS NULL) " +
            "ORDER BY (p.price - p.discountPrice) DESC")
    Page<Product> findDiscountedProducts(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "p.quantity < :threshold AND p.store.id = :storeId")
    Page<Product> findLowStockProducts(@Param("storeId") Long storeId,
                                       @Param("threshold") int threshold,
                                       Pageable pageable);

    List<Product> findByDiscountStartDateAndDiscountActiveFalse(LocalDate date);
    List<Product> findByDiscountEndDateBeforeAndDiscountActiveTrue(LocalDate date);
}