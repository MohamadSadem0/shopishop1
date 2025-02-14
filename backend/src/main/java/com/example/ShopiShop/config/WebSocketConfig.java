package com.example.ShopiShop.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.security.config.annotation.web.messaging.MessageSecurityMetadataSourceRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtAuthChannelInterceptor jwtAuthChannelInterceptor;

    public WebSocketConfig(JwtAuthChannelInterceptor jwtAuthChannelInterceptor) {
        this.jwtAuthChannelInterceptor = jwtAuthChannelInterceptor;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");  // This enables a simple in-memory broker
        config.setApplicationDestinationPrefixes("/app");  // All messages starting with /app are routed to message-handling methods
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000","http://localhost:5000","http://localhost:5500","https://stunning-gelato-710ab3.netlify.app")  // Allow frontend origin
                .withSockJS();  // Fallback option for WebSocket support
    }

    @Override
    public void configureClientInboundChannel(org.springframework.messaging.simp.config.ChannelRegistration registration) {
        registration.interceptors(jwtAuthChannelInterceptor);  // Apply JWT authentication to WebSocket messages
    }


    protected void configureInbound(MessageSecurityMetadataSourceRegistry messages) {
        messages
                .simpDestMatchers("/topic/superadmin-notifications").hasRole("SUPERADMIN")
                .anyMessage().authenticated();  // Require authentication for all messages
    }
}

