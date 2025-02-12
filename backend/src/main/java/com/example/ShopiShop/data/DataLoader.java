//package com.example.ShopiShop.data;
//
//import com.example.ShopiShop.dto.request.StoreRequestDTO;
//import com.example.ShopiShop.enums.UserRoleEnum;
//import com.example.ShopiShop.models.Category;
//import com.example.ShopiShop.models.Section;
//import com.example.ShopiShop.models.User;
//import com.example.ShopiShop.repositories.CategoryRepository;
//import com.example.ShopiShop.repositories.SectionRepository;
//import com.example.ShopiShop.repositories.UserRepository;
//import com.example.ShopiShop.servicesIMPL.StoreServiceImpl;
//import lombok.RequiredArgsConstructor;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//import java.util.Map;
//
//@Component
//@RequiredArgsConstructor
//public class DataLoader implements CommandLineRunner {
//
//    private static final Logger logger = LoggerFactory.getLogger(DataLoader.class);
//
//    private final SectionRepository sectionRepository;
//    private final CategoryRepository categoryRepository;
//    private final UserRepository userRepository;
//    private final StoreServiceImpl storeService;
//    private final PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) {
//        try {
//            loadSectionsAndCategories();
//            createDefaultUsersAndStores();
//        } catch (Exception e) {
//            logger.error("Error during data loading: {}", e.getMessage(), e);
//        }
//    }
//
//    private void loadSectionsAndCategories() {
//        // Map of sections and their default images
//        Map<String, String> sections = Map.of(
//                "Food", "https://i.imgur.com/foodDefault.png",
//                "Fresh", "https://i.imgur.com/2Rmisnj.png",
//                "Flowers", "https://i.imgur.com/t9KWxcq",
//                "Laundry", "https://i.imgur.com/ZyBBIuF"
//        );
//
//        // Map of categories for each section
//        Map<String, List<String>> sectionCategories = Map.of(
//                "Flowers", List.of("Roses", "Tulips", "Lilies", "Orchids"),
//                "Laundry", List.of("Dry Cleaning", "Wash & Fold", "Ironing", "Pickup & Delivery")
//        );
//
//        sections.forEach((name, imageUrl) -> {
//            // Create or retrieve the section
//            Section section = sectionRepository.findByName(name)
//                    .orElseGet(() -> {
//                        Section newSection = new Section(null, name, imageUrl, null);
//                        sectionRepository.save(newSection);
//                        logger.info("Section '{}' created.", name);
//                        return newSection;
//                    });
//
//            // Add categories to the section
//            sectionCategories.getOrDefault(name, List.of()).forEach(categoryName -> {
//                categoryRepository.findByNameAndSectionId(categoryName, section.getId())
//                        .orElseGet(() -> {
//                            Category newCategory = Category.builder()
//                                    .name(categoryName)
//                                    .imageUrl("https://example.com/default-category.jpg")
//                                    .section(section)
//                                    .build();
//                            categoryRepository.save(newCategory);
//                            logger.info("Category '{}' created for section '{}'.", categoryName, name);
//                            return newCategory;
//                        });
//            });
//        });
//
//        logger.info("Sections and categories initialized.");
//    }
//
//    private void createDefaultUsersAndStores() {
//        // Create default users with stores
//        createUserAndStore(
//                "superadmin@example.com",
//                "Super Admin",
//                UserRoleEnum.SUPERADMIN,
//                "SuperSecurePassword",
//                "SuperAdmin Store",
//                "Laundry"
//        );
//
//        createUserAndStore(
//                "merchant@example.com",
//                "Merchant User",
//                UserRoleEnum.MERCHANT,
//                "MerchantSecurePassword",
//                "Merchant's Store",
//                "Laundry"
//        );
//    }
//
//    private void createUserAndStore(String email, String name, UserRoleEnum role, String password, String storeName, String sectionName) {
//        User user = userRepository.findByEmail(email).orElseGet(() -> {
//            User newUser = User.builder()
//                    .userName(name)
//                    .email(email)
//                    .password(passwordEncoder.encode(password))
//                    .userRole(role)
//                    .enabled(true)
//                    .build();
//            userRepository.save(newUser);
//            logger.info("User '{}' created.", email);
//            return newUser;
//        });
//
//        Section section = sectionRepository.findByName(sectionName)
//                .orElseThrow(() -> new RuntimeException("Section not found: " + sectionName));
//
//        if (storeService.isStoreExists(storeName, user.getId())) {
//            logger.info("Store '{}' already exists for user '{}'.", storeName, email);
//            return;
//        }
//
//        StoreRequestDTO storeRequestDTO = StoreRequestDTO.builder()
//                .name(storeName)
//                .ownerId(user.getId())
//                .longitude(-122.4194)
//                .latitude(37.7749)
//                .addressLine("Default Address")
//                .city("San Francisco")
//                .state("CA")
//                .zipCode("94103")
//                .country("USA")
//                .SectionId(section.getId().toString())
//                .build();
//
////        storeService.createStore(storeRequestDTO);
//        logger.info("Store '{}' created for user '{}'.", storeName, email);
//    }
//}
