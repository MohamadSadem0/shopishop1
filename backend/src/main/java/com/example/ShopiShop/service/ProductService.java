package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.enums.DiscountType;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.*;
import com.example.ShopiShop.repositories.CategoryRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl; 
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final DiscountService discountService;
    private final SimpMessagingTemplate messagingTemplate;

    // Product CRUD operations
    @Transactional
    public ProductResponse createProduct(@Valid ProductRequest request) {
        Category category = categoryRepository.findByName(request.categoryName())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        Store store = storeRepository.findById(request.storeId())
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .imageUrl(request.imageUrl())
                .category(category)
                .store(store)
                .isAvailable(true)
                .quantity(request.quantity())
                .discountActive(request.discountActive())
                .totalSell(0)
                .build();

        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public ProductResponse getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapToProductResponse(product);
    }

//    public List<ProductResponse> getProductsByStoreId(Long storeId) {
//        Store store = storeRepository.findById(storeId)
//                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
//
//        List<Product> products = productRepository.findByStoreId(storeId);
//        if (products.isEmpty()) {
//            throw new ResourceNotFoundException("No products found for this store");
//        }
//
//        return products.stream()
//                .map(this::mapToProductResponse)
//                .toList();
//    }


    public Page<ProductResponse> getProductsByStoreId(
            Long storeId,
            int page,
            int size,
            UUID cursorId,
            LocalDateTime cursorDate) {

        Page<Product> productPage;

        if (cursorId == null || cursorDate == null) {
            // First page load
            productPage = productRepository.findByStoreIdFirstPage(
                    storeId,
                    PageRequest.of(page, size, Sort.by("createdAt").descending().and(Sort.by("id").descending()))
            );
        } else {
            // Subsequent pages with cursor
            productPage = productRepository.findByStoreIdAfterCursor(
                    storeId,
                    cursorId,
                    cursorDate,
                    PageRequest.of(0, size) // Always page 0 for cursor-based
            );
        }

        return productPage.map(this::mapToProductResponse);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
        discountService.clearDiscountCache(id);
    }

    public Page<ProductResponse> getPaginatedProducts(int page, int size, String category) {
        Page<Product> productPage = category != null && !category.isEmpty() ?
                productRepository.findByCategoryName(category, PageRequest.of(page, size)) :
                productRepository.findAll(PageRequest.of(page, size));
        return productPage.map(this::mapToProductResponse);
    }

    public ProductResponse getProductByName(String name) {
        Product product = productRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with name: " + name));
        return mapToProductResponse(product);
    }

    // Special product listings
    public List<ProductResponse> getBestDeals() {
        return productRepository.findTop5ByOrderByTotalSellDesc().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<ProductResponse> getFeaturedProducts() {
        return productRepository.findTop10ByOrderByTotalSellDesc().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public Page<ProductResponse> getBestSellingProducts(int page, int size) {
        return productRepository.findAllByOrderByTotalSellDesc(PageRequest.of(page, size))
                .map(this::mapToProductResponse);
    }

    public List<ProductResponse> getProductsWithActiveDiscounts() {
        return productRepository.findActiveDiscountProducts().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<ProductResponse> getTopDiscountProducts() {
        return productRepository.findTopDiscountProducts().stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    // Update operations
    @Transactional
    public ProductResponse updateProduct(UUID productId, @Valid ProductUpdateRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());

        Product updatedProduct = productRepository.save(product);
        discountService.clearDiscountCache(productId);
        return mapToProductResponse(updatedProduct);
    }

    @Transactional
    public ProductResponse updateProductQuantity(UUID productId, UpdateProductQuantityRequest request, User currentUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        if (!product.getStore().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: You are not the owner of this store");
        }

        product.setQuantity(request.quantity());
        Product updatedProduct = productRepository.save(product);

        messagingTemplate.convertAndSend("/topic/stockUpdates", new StockUpdate(product.getId(), product.getQuantity()));
        discountService.clearDiscountCache(productId);

        return mapToProductResponse(updatedProduct);
    }

    // Discount operations
    @Transactional
    public ProductResponse applyDiscount(UUID productId, DiscountRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        validateDiscountRequest(product, request);

        product.setDiscountType(request.discountType());
        product.setDiscountValue(request.discountValue());
        product.setDiscountStartDate(request.startDate());
        product.setDiscountEndDate(request.endDate());
        product.setDiscountName(request.name());
        product.setDiscountMinQuantity(request.minQuantity());

        BigDecimal discountPrice = discountService.calculateDiscountedPrice(product);
        product.setDiscountPrice(discountPrice);

        boolean shouldActivate = discountService.isDiscountApplicable(product);
        product.setDiscountActive(shouldActivate);

        Product updatedProduct = productRepository.save(product);
        discountService.clearDiscountCache(productId);

        return mapToProductResponse(updatedProduct);
    }

    @Transactional
    public void removeDiscount(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setDiscountActive(false);
        product.setDiscountPrice(null);
        product.setDiscountValue(null);
        product.setDiscountType(null);
        product.setDiscountStartDate(null);
        product.setDiscountEndDate(null);
        product.setDiscountName(null);
        product.setDiscountMinQuantity(1);

        productRepository.save(product);
        discountService.clearDiscountCache(productId);
    }

    // Helper methods
    private void validateDiscountRequest(Product product, DiscountRequest request) {
        if (request.discountType() == DiscountType.PERCENTAGE &&
                (request.discountValue().compareTo(BigDecimal.valueOf(100)) > 0 ||
                        request.discountValue().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new IllegalArgumentException("Percentage discount must be between 0 and 100");
        }

        if (request.discountType() == DiscountType.FIXED_AMOUNT &&
                request.discountValue().compareTo(product.getPrice()) >= 0) {
            throw new IllegalArgumentException("Fixed amount discount must be less than product price");
        }

        if (request.startDate() != null && request.endDate() != null &&
                request.startDate().isAfter(request.endDate())) {
            throw new IllegalArgumentException("Discount start date must be before end date");
        }

        if (request.minQuantity() < 1) {
            throw new IllegalArgumentException("Minimum quantity must be at least 1");
        }
    }

//    private ProductResponse mapToProductResponse(Product product) {
//        List<ReviewResponse> reviewResponses = product.getReviews() != null ?
//                product.getReviews().stream().map(this::mapToReviewResponse).toList() :
//                Collections.emptyList();
//
//        BigDecimal originalPrice = product.getPrice();
//        BigDecimal finalPrice = discountService.calculateEffectivePrice(product);
//
//        DiscountInfo discountInfo = product.getDiscountActive() ?
//                new DiscountInfo(
//                        product.getDiscountType(),
//                        product.getDiscountValue(),
//                        product.getDiscountStartDate(),
//                        product.getDiscountEndDate(),
//                        product.getDiscountName(),
//                        product.getDiscountMinQuantity()
//                ) : null;
//
//        return new ProductResponse(
//                product.getId(),
//                product.getName(),
//                product.getDescription(),
//                originalPrice,      // Original price
//                finalPrice,        // Price after discount (or original if no discount)
//                product.getImageUrl(),
//                product.getCategory() != null ? product.getCategory().getName() : "",
//                product.getStore() != null ? product.getStore().getId() : null,
//                product.getIsAvailable(),
//                product.getStore() != null ? product.getStore().getName() : null,
//                product.getQuantity(),
//                reviewResponses,
//                product.getTotalSell(),
//                calculateAverageRating(product.getReviews()),
//                discountInfo       // Discount details (null if no discount)
//        );
//    }

    private ProductResponse mapToProductResponse(Product product) {
        // Handle null collections
        List<Review> reviews = product.getReviews() != null ? product.getReviews() : Collections.emptyList();

        // Calculate prices
        BigDecimal originalPrice = product.getPrice();
//        BigDecimal finalPrice = discountService.calculateEffectivePrice(product);
        BigDecimal finalPrice = discountService.calculateEffectivePrice(product);

        // Build discount info if active
        DiscountInfo discountInfo = null;
        if (product.getDiscountActive() && product.getDiscountType() != null) {
            discountInfo = new DiscountInfo(
                    product.getDiscountType(),
                    product.getDiscountValue(),
                    product.getDiscountStartDate(),
                    product.getDiscountEndDate(),
                    product.getDiscountName(),
                    product.getDiscountMinQuantity()
            );
        }

        // Map reviews
        List<ReviewResponse> reviewResponses = reviews.stream()
                .map(this::mapToReviewResponse)
                .toList();

        // Safely get store and category names
        String storeName = product.getStore() != null ? product.getStore().getName() : null;
        String categoryName = product.getCategory() != null ? product.getCategory().getName() : "";

        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                originalPrice,
                product.getDiscountPrice(),
                product.getImageUrl(),
                categoryName,
                product.getStore() != null ? product.getStore().getId() : null,
                product.getIsAvailable(),
                storeName,
                product.getQuantity(),
                reviewResponses,
                product.getTotalSell(),
                calculateAverageRating(reviews),
                discountInfo,
                product.getDiscountValue()
        );
    }
    private Double calculateAverageRating(List<Review> reviews) {
        if (reviews == null || reviews.isEmpty()) {
            return null;
        }
        return reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    private ReviewResponse mapToReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getRating(),
                review.getComment(),
                review.getUser().getId(),
                review.getUser().getName(),
                review.getProduct().getName(),
                review.getCreatedAt()
        );
    }

    @Transactional
    public List<ProductResponse> applyBulkDiscount(List<UUID> productIds, DiscountRequest request) {
        return productIds.stream()
                .map(id -> applyDiscount(id, request))
                .toList();
    }

    // Add validation helper
    public void validateDiscount(Product product, DiscountRequest request) {
        if (request.discountType() == DiscountType.PERCENTAGE &&
                (request.discountValue().compareTo(BigDecimal.valueOf(100)) > 0 ||
                        request.discountValue().compareTo(BigDecimal.ZERO) <= 0)) {
            throw new IllegalArgumentException("Percentage must be 0-100");
        }

        if (request.discountType() == DiscountType.FIXED_AMOUNT &&
                request.discountValue().compareTo(product.getPrice()) >= 0) {
            throw new IllegalArgumentException("Discount must be less than price");
        }
    }

    public List<ProductResponse> getExpiringDiscounts(Long storeId, int daysThreshold) {
        LocalDate thresholdDate = LocalDate.now().plusDays(daysThreshold);
        return productRepository.findByStoreIdAndDiscountActiveTrueAndDiscountEndDateBefore(
                        storeId, thresholdDate)
                .stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<DiscountStatusResponse> getDiscountStatuses(List<UUID> productIds) {
        return productRepository.findAllById(productIds).stream()
                .map(product -> new DiscountStatusResponse(
                        product.getId(),
                        product.getName(),
                        product.getPrice(),
                        discountService.calculateEffectivePrice(product),
                        product.getDiscountActive() ?
                                new DiscountInfo(
                                        product.getDiscountType(),
                                        product.getDiscountValue(),
                                        product.getDiscountStartDate(),
                                        product.getDiscountEndDate(),
                                        product.getDiscountName(),
                                        product.getDiscountMinQuantity()
                                ) : null,
                        product.isDiscountCurrentlyActive(),
                        product.getDiscountEndDate() != null ?
                                ChronoUnit.DAYS.between(LocalDate.now(), product.getDiscountEndDate()) : null
                ))
                .toList();
    }

    public Page<ProductResponse> getPaginatedProducts(int page, int size, String category, UUID lastSeenId, LocalDateTime lastSeenDate) {
        PageRequest pageRequest = PageRequest.of(0, size); // Always query first page for cursor

        List<Product> products = productRepository.findNextPage(
                category,
                lastSeenId,
                lastSeenDate,
                pageRequest
        );

        // Map to DTO with only essential fields
        return new PageImpl<>(
                products.stream()
                        .map(this::mapToProductPreviewResponse) // Lightweight mapping
                        .toList(),
                pageRequest,
                products.size()
        );
    }

    private ProductResponse mapToProductPreviewResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                null, // Skip description for listings
                product.getPrice(),
                product.getDiscountValue(),
                product.getImageUrl(),
                product.getCategory().getName(),
                product.getStore().getId(),
                product.getIsAvailable(),
                null, // Skip store name for listings
                product.getQuantity(),
                null, // Skip reviews for listings
                product.getTotalSell(),
                null, // Skip rating for listings
                product.getDiscountActive() ?
                        new DiscountInfo(
                                product.getDiscountType(),
                                product.getDiscountValue(),
                                null, null, null, 1// Minimal discount info
                        ) : null,
                product.getDiscountValue()
        );
    }

}