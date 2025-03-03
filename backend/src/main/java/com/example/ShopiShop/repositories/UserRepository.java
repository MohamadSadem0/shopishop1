package com.example.ShopiShop.repositories;

import com.example.ShopiShop.enums.UserRoleEnum;
import com.example.ShopiShop.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByUserRole(UserRoleEnum userRole);
//    User findByConfirmationToken(String confirmationToken);

    Optional<User> findByResetPasswordToken(String token);

    boolean existsByEmail(String email);

    Optional<User> findByConfirmationToken(String confirmationToken);

   Optional<User>findById(Long uuid);
}
