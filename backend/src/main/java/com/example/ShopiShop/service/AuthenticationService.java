package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.AuthenticationRequest;
import com.example.ShopiShop.dto.LoginResponse;
import com.example.ShopiShop.dto.RegisterRequest;
import com.example.ShopiShop.dto.StoreDetails;
import com.example.ShopiShop.enums.UserRoleEnum;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.exceptions.RessourceAlreadyExistException;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;
import java.util.Hashtable;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final EmailVerificationService emailVerificationService; // Injected service


    private static final String DEFAULT_PROFILE_PIC = "";

    public String register(RegisterRequest request) {
        // Use one of the third-party verifiers, e.g., Mailboxlayer
        if (!emailVerificationService.verifyWithMailboxlayer(request.email())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is invalid or cannot receive emails.");
        }

        if (userRepository.existsByEmail(request.email())) {
            throw new RessourceAlreadyExistException("email");
        }

        String confirmationToken = UUID.randomUUID().toString();

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .profilePictureUrl(Optional.ofNullable(request.profilePictureUrl()).orElse(""))
                .userRole(UserRoleEnum.CUSTOMER)
                .enabled(false)
                .confirmationToken(confirmationToken)
                .build();

        userRepository.save(user);
        emailService.sendConfirmationEmail(user.getEmail(), confirmationToken);
        return "Registration successful. Please check your email to activate your account.";
    }


    public LoginResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResourceNotFoundException("email"));

        // Check if the account is activated
        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Account not activated. Please check your email for the activation link.");
        }

        String token = jwtService.generateToken(user);

        StoreDetails storeDetails = null;
        if (user.getUserRole() == UserRoleEnum.MERCHANT && user.getStore() != null) {
            storeDetails = new StoreDetails(
                    user.getStore().getId(),
                    user.getStore().getName(),
                    user.getStore().getSection().getName(),
                    user.getStore().getAddress(),
                    user.getStore().getDescription(),
                    user.getStore().getImageUrl(),
                    user.getStore().isApproved()
            );
        }

        return new LoginResponse(
                token,
                user.getName(),
                Optional.ofNullable(user.getPhoneNbr()).orElse(""),
                user.getEmail(),
                user.getProfilePictureUrl(),
                user.getUserRole().name(),
                storeDetails
        );
    }

    public String confirmAccount(String token) {
        Optional<User> optionalUser = userRepository.findByConfirmationToken(token);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired token");
        }
        User user = optionalUser.get();
        user.setEnabled(true);
        user.setConfirmationToken(null);
        userRepository.save(user);
        return "Account activated successfully.";
    }

    public String requestPasswordReset(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        // For security, you may always return a success message even if the user is not found.
        if (optionalUser.isEmpty()) {
            return "If the email exists, a password reset link has been sent.";
        }
        User user = optionalUser.get();
        String resetToken = UUID.randomUUID().toString();
        user.setResetPasswordToken(resetToken);
        userRepository.save(user);
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        return "If the email exists, a password reset link has been sent.";
    }

    // 2. Reset Password using the token from email
    public String resetPassword(String token, String newPassword) {
        Optional<User> optionalUser = userRepository.findByResetPasswordToken(token);
        if (optionalUser.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid or expired reset token");
        }
        User user = optionalUser.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        // Clear the reset token after successful update
        user.setResetPasswordToken(null);
        userRepository.save(user);
        return "Password reset successfully.";
    }

    // 3. Update Password for authenticated user (old password + new password)
    public String updatePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        return "Password updated successfully.";
    }



}
