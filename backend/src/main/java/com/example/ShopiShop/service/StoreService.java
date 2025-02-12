package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.StoreRequest;
import com.example.ShopiShop.dto.StoreResponse;
import com.example.ShopiShop.enums.UserRoleEnum;
import com.example.ShopiShop.exceptions.CustomException;
import com.example.ShopiShop.models.Section;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.SectionRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import com.example.ShopiShop.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final SectionRepository sectionRepository;

    public StoreResponse createStore(Long userId, StoreRequest request) {
        // Fetch user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        // Ensure user is not already a seller
        if (user.getUserRole() == UserRoleEnum.MERCHANT) {
            throw new CustomException("User is already a seller");
        }

        // Check if user already owns a store
        Optional<Store> existingStore = storeRepository.findByOwnerId(userId);
        if (existingStore.isPresent()) {
            throw new CustomException("User already owns a store");
        }

        // Fetch section and validate existence
        Section section = sectionRepository.findByName(request.sectionName())
                .orElseThrow(() -> new CustomException("Section not found"));

        // Create store
        Store store = Store.builder()
                .name(request.name())
                .owner(user)
                .address(request.address())
                .description(request.description())
                .imageUrl(request.imageUrl())
                .section(section)  // Assign the section
                .isApproved(false) // Store approval pending
                .build();

        Store savedStore = storeRepository.save(store);

        // Update user role to MERCHANT
        user.setUserRole(UserRoleEnum.MERCHANT);
        userRepository.save(user);

        return new StoreResponse(
                savedStore.getId(),
                savedStore.getName(),
                user.getName(),
                savedStore.getAddress(),
                savedStore.getDescription(),
                savedStore.getImageUrl(),
                savedStore.isApproved(),
                section.getId(),
                section.getName()
        );
    }
}
