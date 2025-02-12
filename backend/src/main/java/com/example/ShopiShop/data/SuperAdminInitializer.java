package com.example.ShopiShop.data;

import com.example.ShopiShop.enums.UserRoleEnum;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SuperAdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String superAdminEmail = "admin@shopishop.com";

        // Check if a Super Admin already exists
        if (userRepository.existsByEmail(superAdminEmail)) {
            System.out.println("✅ Super Admin already exists.");
            return;
        }

        // Create Super Admin
        User superAdmin = User.builder()
                .name("Super Admin")
                .email(superAdminEmail)
                .password(passwordEncoder.encode("admin123")) // Secure password
                .userRole(UserRoleEnum.SUPERADMIN)
                .enabled(true)
                .profilePictureUrl("https://example.com/default-admin-avatar.png") // Default profile pic
                .build();

        userRepository.save(superAdmin);
        System.out.println("🚀 Super Admin created successfully! Email: " + superAdminEmail);
    }
}
