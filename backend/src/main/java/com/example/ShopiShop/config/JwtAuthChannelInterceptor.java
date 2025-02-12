package com.example.ShopiShop.config;

import com.example.ShopiShop.models.User;
import com.example.ShopiShop.repositories.UserRepository;
import com.example.ShopiShop.security.JwtService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class JwtAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthChannelInterceptor(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Extract the Authorization header
            List<String> authorizationHeaders = accessor.getNativeHeader("Authorization");
            if (authorizationHeaders != null && !authorizationHeaders.isEmpty()) {
                String authToken = authorizationHeaders.get(0);

                // Ensure token starts with "Bearer "
                if (authToken.startsWith("Bearer ")) {
                    String jwt = authToken.substring(7);

                    // Extract email from token and authenticate user
                    String userEmail = jwtService.extractEmail(jwt);
                    User user = userRepository.findByEmail(userEmail).orElse(null);

                    if (user != null && jwtService.isTokenValid(jwt, user)) {
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                        // Set authentication context for WebSocket connection
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    } else {
                        throw new IllegalArgumentException("Invalid JWT Token or User not found");
                    }
                }
            }
        }
        return message;
    }
}
