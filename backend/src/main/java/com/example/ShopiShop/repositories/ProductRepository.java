package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.models.Store;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    List<Product> findByStoreId(Long storeId);

    List<Product> findByCategoryId(UUID categoryId);
    // Fetch paginated products
    Page<Product> findAll(Pageable pageable);
    Optional<Product> findByName(String name);


    // Fetch paginated products by category
    Page<Product> findByCategoryName(String categoryName, Pageable pageable);

    // Fetch paginated products by store ID
    Page<Product> findByStoreId(Long storeId, Pageable pageable);

    Optional<Product> findById(UUID id);



    // Best deals: top 5 products by totalSell (descending)
    List<Product> findTop5ByOrderByTotalSellDesc();

    // Featured: top 10 products by totalSell (descending)
    List<Product> findTop10ByOrderByTotalSellDesc();

    Page<Product> findAllByOrderByTotalSellDesc(Pageable pageable);

}