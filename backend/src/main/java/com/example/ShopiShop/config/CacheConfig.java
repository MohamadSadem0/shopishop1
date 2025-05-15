//package com.example.ShopiShop.config;
//
//import com.github.benmanes.caffeine.cache.Caffeine;
//import org.springframework.cache.CacheManager;
//import org.springframework.cache.annotation.EnableCaching;
//import org.springframework.cache.caffeine.CaffeineCacheManager;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.concurrent.TimeUnit;
//
//@Configuration
//@EnableCaching
//public class CacheConfig {
//
//    @Bean
//    public CacheManager cacheManager() {
//        return new CustomCaffeineCacheManager();
//    }
//
//    static class CustomCaffeineCacheManager extends CaffeineCacheManager {
//        @Override
//        protected com.github.benmanes.caffeine.cache.Cache<Object, Object> createNativeCaffeineCache(String name) {
//            Caffeine<Object, Object> builder;
//            switch (name) {
//                case "products":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(5000)
//                            .expireAfterWrite(2, TimeUnit.HOURS);
//                    break;
//                case "product":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(1000)
//                            .expireAfterWrite(4, TimeUnit.HOURS);
//                    break;
//                case "storeProducts":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(3000)
//                            .expireAfterWrite(1, TimeUnit.HOURS);
//                    break;
//                case "bestDeals":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(500)
//                            .expireAfterWrite(30, TimeUnit.MINUTES);
//                    break;
//                case "featuredProducts", "topDiscounts":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(500)
//                            .expireAfterWrite(1, TimeUnit.HOURS);
//                    break;
//                case "bestSelling":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(1000)
//                            .expireAfterWrite(2, TimeUnit.HOURS);
//                    break;
//                case "activeDiscounts":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(1000)
//                            .expireAfterWrite(30, TimeUnit.MINUTES);
//                    break;
//                case "paginatedProducts":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(2000)
//                            .expireAfterWrite(1, TimeUnit.HOURS);
//                    break;
//                case "expiringDiscounts":
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(1000)
//                            .expireAfterWrite(3, TimeUnit.HOURS);
//                    break;
//                default:
//                    builder = Caffeine.newBuilder()
//                            .maximumSize(500)
//                            .expireAfterWrite(30, TimeUnit.MINUTES);
//            }
//            return builder.build();
//        }
//    }
//}


package com.example.ShopiShop.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        return new CustomCaffeineCacheManager();
    }

    static class CustomCaffeineCacheManager extends CaffeineCacheManager {
        @Override
        protected com.github.benmanes.caffeine.cache.Cache<Object, Object> createNativeCaffeineCache(String name) {
            Caffeine<Object, Object> builder;
            switch (name) {
                case "products":
                    builder = Caffeine.newBuilder()
                            .maximumSize(5000)
                            .expireAfterWrite(2, TimeUnit.HOURS);
                    break;
                case "product":
                    builder = Caffeine.newBuilder()
                            .maximumSize(1000)
                            .expireAfterWrite(4, TimeUnit.HOURS);
                    break;
                case "storeProducts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(3000)
                            .expireAfterWrite(1, TimeUnit.HOURS);
                    break;
                case "bestDeals":
                    builder = Caffeine.newBuilder()
                            .maximumSize(500)
                            .expireAfterWrite(30, TimeUnit.MINUTES);
                    break;
                case "featuredProducts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(500)
                            .expireAfterWrite(1, TimeUnit.HOURS);
                    break;
                case "bestSelling":
                    builder = Caffeine.newBuilder()
                            .maximumSize(1000)
                            .expireAfterWrite(2, TimeUnit.HOURS);
                    break;
                case "activeDiscounts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(1000)
                            .expireAfterWrite(30, TimeUnit.MINUTES);
                    break;
                case "topDiscounts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(500)
                            .expireAfterWrite(1, TimeUnit.HOURS);
                    break;
                case "paginatedProducts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(2000)
                            .expireAfterWrite(1, TimeUnit.HOURS);
                    break;
                case "expiringDiscounts":
                    builder = Caffeine.newBuilder()
                            .maximumSize(1000)
                            .expireAfterWrite(3, TimeUnit.HOURS);
                    break;
                default:
                    builder = Caffeine.newBuilder()
                            .maximumSize(500)
                            .expireAfterWrite(30, TimeUnit.MINUTES);
            }
            return builder.build();
        }
    }
}
