package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.User;
import com.example.ShopiShop.models.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    VerificationToken findByUser(User user);
}
