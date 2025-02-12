package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface StoreRepository extends JpaRepository<Store,Long>{
    Optional<Store> findByOwnerEmail(String email); // Assuming "owner" is the User associated with the store
    List<Store> findBySectionId(UUID sectionId);
    List<Store> findAllBySectionId(UUID sectionId);
    Optional<Store> findByOwnerId(Long ownerId);


    boolean existsByNameAndOwnerId(String storeName, Long ownerId);
}
