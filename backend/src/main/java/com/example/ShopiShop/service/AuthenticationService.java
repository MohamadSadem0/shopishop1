package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.AuthenticationRequest;
import com.example.ShopiShop.dto.RegisterRequest;
import com.example.ShopiShop.enums.UserRoleEnum;
import com.example.ShopiShop.exceptions.EmailAlreadyExistsException;
import com.example.ShopiShop.exceptions.InvalidCredentialsException;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private static final String DEFAULT_PROFILE_PIC = "";

    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new EmailAlreadyExistsException();
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .profilePictureUrl(Optional.ofNullable(request.profilePictureUrl()).orElse(DEFAULT_PROFILE_PIC))
                .userRole(UserRoleEnum.CUSTOMER)
                .enabled(true)
                .build();

        userRepository.save(user);
        return jwtService.generateToken(user);
    }

    public Map<String, Object> authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        String token = jwtService.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getName());
        response.put("phoneNbr", Optional.ofNullable(user.getPhoneNbr()).orElse(""));
        response.put("email", user.getEmail());
        response.put("photoUrl", user.getProfilePictureUrl());
        response.put("role", user.getUserRole().name());

        // If the user is a MERCHANT, include store details
        if (user.getUserRole() == UserRoleEnum.MERCHANT && user.getStore() != null) {
            response.put("storeDetails", buildStoreDetails(user.getStore()));
        }

        return response;
    }

    private Map<String, Object> buildStoreDetails(Store store) {
        Map<String, Object> storeDetails = new HashMap<>();
        storeDetails.put("storeId", store.getId());
        storeDetails.put("storeName", store.getName());
        storeDetails.put("sectionName",store.getSection().getName());
        storeDetails.put("storeAddress", store.getAddress());
        storeDetails.put("storeDescription", store.getDescription());
        storeDetails.put("storeImage", store.getImageUrl());
        storeDetails.put("isApproved", store.isApproved());
        return storeDetails;
    }
}
