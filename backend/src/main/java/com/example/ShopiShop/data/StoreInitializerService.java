//package com.example.ShopiShop.data;
//
//import com.example.ShopiShop.dto.reques.StoreRequestDTO;
//import com.example.ShopiShop.models.Section;
//import com.example.ShopiShop.models.User;
//import com.example.ShopiShop.repositories.SectionRepository;
//import com.example.ShopiShop.repositories.UserRepository;
//import com.example.ShopiShop.servicesIMPL.StoreServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class StoreInitializerService {
//
//    private static final Logger logger = LoggerFactory.getLogger(StoreInitializerService.class);
//
//    private final StoreServiceImpl storeService;
//    private final SectionRepository sectionRepository;
//    private final UserRepository userRepository;
//
//    public void createStores() {
//        createStore(
//                "superadmin@example.com",
//                "SuperAdmin Store",
//                "Laundry",
//                "123 Main Street",
//                -122.4194,
//                37.7749
//        );
//
//        createStore(
//                "merchant@example.com",
//                "Merchant's Store",
//                "Laundry",
//                "456 Commerce Street",
//                -122.4194,
//                37.7749
//        );
//    }
//
//    private void createStore(String ownerEmail, String storeName, String sectionName, String addressLine, double longitude, double latitude) {
//        User owner = userRepository.findByEmail(ownerEmail)
//                .orElseThrow(() -> new RuntimeException("User not found with email: " + ownerEmail));
//
//        Section section = sectionRepository.findByName(sectionName)
//                .orElseThrow(() -> new RuntimeException("Section not found: " + sectionName));
//
//        StoreRequestDTO storeRequestDTO = StoreRequestDTO.builder()
//                .name(storeName)
//                .ownerId(owner.getId())
//                .longitude(longitude)
//                .latitude(latitude)
//                .addressLine(addressLine)
//                .city("San Francisco")
//                .state("CA")
//                .zipCode("94103")
//                .country("USA")
//                .SectionId(section.getId().toString())
//                .build();
//
//        storeService.createStore(storeRequestDTO);
//        logger.info("Store '{}' created for user '{}'.", storeName, ownerEmail);
//    }
//}
