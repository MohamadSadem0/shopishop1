package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.Section;
import com.example.ShopiShop.models.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SectionRepository extends JpaRepository<Section, UUID> {
    Optional<Section> findByName(String name);
    Optional<Section> findById(UUID id);



}

