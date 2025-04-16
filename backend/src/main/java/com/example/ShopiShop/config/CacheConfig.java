package com.example.ShopiShop.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // Default configuration
        cacheManager.setCacheSpecification("maximumSize=500,expireAfterWrite=30m");
        
        // Custom configurations based on data access patterns
        cacheManager.registerCustomCache("products", 
            Caffeine.newBuilder()
                .maximumSize(5000)
                .expireAfterWrite(2, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("product", 
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(4, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("storeProducts", 
            Caffeine.newBuilder()
                .maximumSize(3000)
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("bestDeals", 
            Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .build());
                
        cacheManager.registerCustomCache("featuredProducts", 
            Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("bestSelling", 
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(2, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("activeDiscounts", 
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(30, TimeUnit.MINUTES)
                .build());
                
        cacheManager.registerCustomCache("topDiscounts", 
            Caffeine.newBuilder()
                .maximumSize(500)
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("paginatedProducts", 
            Caffeine.newBuilder()
                .maximumSize(2000)
                .expireAfterWrite(1, TimeUnit.HOURS)
                .build());
                
        cacheManager.registerCustomCache("expiringDiscounts", 
            Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(3, TimeUnit.HOURS)
                .build());
                
        return cacheManager;
    }
}