package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.enums.DiscountType;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.*;
import com.example.ShopiShop.repositories.CategoryRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import jakarta.persistence.OptimisticLockException;
import jakarta.transaction.Transactional;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final StoreRepository storeRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final DiscountCalculator discountCalculator;



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

    public List<ProductResponse> getProductsByStoreId(Long storeId) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));

        List<Product> products = productRepository.findByStoreId(storeId);
        if (products.isEmpty()) {
            throw new ResourceNotFoundException("No products found for this store");
        }

        return products.stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public Page<ProductResponse> getPaginatedProducts(int page, int size, String category) {
        Page<Product> productPage;
        if (category != null && !category.isEmpty()) {
            productPage = productRepository.findByCategoryName(category, PageRequest.of(page, size));
        } else {
            productPage = productRepository.findAll(PageRequest.of(page, size));
        }

        return productPage.map(this::mapToProductResponse);
    }

    public ProductResponse getProductByName(String name) {
        Product product = productRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with name: " + name));
        return mapToProductResponse(product);
    }

    // ============================
    // Private Helper Method
    // ============================
    private ProductResponse mapToProductResponse(Product product) {
        List<ReviewResponse> reviewResponses = product.getReviews() != null ?
                product.getReviews().stream().map(this::mapToReviewResponse).toList() :
                Collections.emptyList();

        boolean isDiscountActive = isDiscountActive(product);
        BigDecimal effectivePrice = isDiscountActive ?
                product.getDiscountPrice() : product.getPrice();
        String discountDescription = isDiscountActive ?
                formatDiscountDescription(product) : null;
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory() != null ? product.getCategory().getName() : null,
                product.getEffectivePrice(), // Use the calculated effective price
                product.getStore() != null ? product.getStore().getId() : null,
                product.getIsAvailable(),
                product.getStore() != null ? product.getStore().getName() : null,
                product.getQuantity(),
                reviewResponses,

                // Enhanced discount fields
                isDiscountActive(product),
                product.getDiscountStartDate(),
                product.getDiscountEndDate(),
                product.getDiscountName(),
                product.getDiscountType(),
                product.getDiscountValue(),
                product.getDiscountPrice(),
                product.getDiscountMinQuantity(),

                // Additional product metrics
                product.getTotalSell(),
                calculateAverageRating(product.getReviews())
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

    // New helper method to check active discounts
    private boolean isDiscountActive(Product product) {
        if (product.getDiscountPrice() == null || !Boolean.TRUE.equals(product.getDiscountActive())) {
            return false;
        }
        LocalDate today = LocalDate.now();
        return (product.getDiscountStartDate() == null || !today.isBefore(product.getDiscountStartDate())) &&
                (product.getDiscountEndDate() == null || !today.isAfter(product.getDiscountEndDate()));
    }

    // New helper method for formatted discount display
    private String formatDiscountDescription(Product product) {
        if (product.getDiscountType() == DiscountType.PERCENTAGE) {
            return product.getDiscountValue() + "% OFF";
        } else if (product.getDiscountType() == DiscountType.FIXED_AMOUNT) {
            return "$" + product.getDiscountValue() + " OFF";
        }
        return product.getDiscountName() != null ? product.getDiscountName() : "Special Offer";
    }

    // Enhanced applyDiscount with retry mechanism
    @Transactional
    public ProductResponse applyDiscount(UUID productId, DiscountRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Add explicit validation
        if (request.discountType() == DiscountType.FIXED_AMOUNT) {
            if (request.discountValue().compareTo(product.getPrice()) >= 0) {
                throw new IllegalArgumentException(
                        "Fixed amount discount must be less than original price ($" + product.getPrice() + ")"
                );
            }
        }

        try {
            applyDiscountToProduct(product, request);
            Product saved = productRepository.saveAndFlush(product); // Use saveAndFlush to immediately see errors
            return mapToProductResponse(saved);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalStateException("Database constraint violation: " + e.getMessage());
        } catch (OptimisticLockingFailureException e) {
            throw new OptimisticLockException("Product was modified by another transaction. Please try again.");
        }
    }

    // Extracted discount application logic
    private void applyDiscountToProduct(Product product, DiscountRequest request) {
        product.setDiscountType(request.discountType());
        product.setDiscountValue(request.discountValue());
        product.setDiscountPrice(calculateDiscountPrice(product, request));
        product.setDiscountStartDate(request.startDate());
        product.setDiscountEndDate(request.endDate());
        product.setDiscountName(request.name());
        product.setDiscountActive(true);
        product.setDiscountMinQuantity(request.minQuantity());
    }

    private BigDecimal calculateDiscountPrice(Product product, DiscountRequest request) {
        return request.discountedPrice() != null ?
                request.discountedPrice() :
                discountCalculator.calculateDiscountedPrice(product);
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


    public List<ProductResponse> getBestDeals() {
        List<Product> products = productRepository.findTop5ByOrderByTotalSellDesc();
        return products.stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public List<ProductResponse> getFeaturedProducts() {
        List<Product> products = productRepository.findTop10ByOrderByTotalSellDesc();
        return products.stream()
                .map(this::mapToProductResponse)
                .toList();
    }

    public Page<ProductResponse> getBestSellingProducts(int page, int size) {
        // Create a PageRequest object to handle pagination
        PageRequest pageRequest = PageRequest.of(page, size);

        // Fetch products in descending order of totalSell
        Page<Product> productPage = productRepository.findAllByOrderByTotalSellDesc(pageRequest);

        // Convert Product -> ProductResponse
        return productPage.map(this::mapToProductResponse);
    }



    private void validateDiscount(DiscountRequest request, BigDecimal originalPrice) {
        if (request.discountType() == DiscountType.FIXED_AMOUNT &&
                request.discountValue().compareTo(originalPrice) >= 0) {
            throw new IllegalArgumentException(
                    "Fixed amount discount must be less than original price"
            );
        }

        if (request.discountType() == DiscountType.PERCENTAGE &&
                (request.discountValue().compareTo(BigDecimal.ZERO) <= 0 ||
                        request.discountValue().compareTo(BigDecimal.valueOf(100)) > 0)) {
            throw new IllegalArgumentException(
                    "Percentage discount must be between 0 and 100"
            );
        }

        if (request.startDate() != null && request.endDate() != null &&
                request.startDate().isAfter(request.endDate())) {
            throw new IllegalArgumentException(
                    "Discount end date must be after start date"
            );
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional
    public void updateDiscountStatuses() {
        LocalDate today = LocalDate.now();

        // Activate discounts that should start today
        List<Product> productsToActivate = productRepository.findByDiscountStartDateAndDiscountActiveFalse(today);
        productsToActivate.forEach(product -> {
            product.setDiscountActive(true);
            productRepository.save(product);
        });

        // Deactivate expired discounts
        List<Product> productsToDeactivate = productRepository.findByDiscountEndDateBeforeAndDiscountActiveTrue(today.minusDays(1));
        productsToDeactivate.forEach(product -> {
            product.setDiscountActive(false);
            productRepository.save(product);
        });
    }

    // Add method to remove discount
    @Transactional
    public ProductResponse removeDiscount(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Clear all discount-related fields
        product.setDiscountPrice(null);
        product.setDiscountActive(false);
        product.setDiscountType(null);
        product.setDiscountValue(null);
        product.setDiscountStartDate(null);
        product.setDiscountEndDate(null);
        product.setDiscountName(null);
        product.setDiscountMinQuantity(null);

        Product saved = productRepository.save(product);
        return mapToProductResponse(saved);
    }


    @Transactional
    public ProductResponse updateProduct(UUID productId, @Valid ProductUpdateRequest request) {
        // Retrieve the existing product
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Update product fields with the new data from the request
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setImageUrl(request.imageUrl());

        // Update category: fetch the Category by name
//        Category category = categoryRepository.findByName(request.categoryName())
//                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
//        product.setCategory(category);

        // Save the updated product
        Product updatedProduct = productRepository.save(product);

        // Map to DTO and return
        return mapToProductResponse(updatedProduct);
    }



    @Transactional
    public ProductResponse updateProductQuantity(UUID productId, UpdateProductQuantityRequest request, User currentUser) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        // Check if the current user is the owner of the product's store
        if (!product.getStore().getOwner().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Unauthorized: You are not the owner of this store");
        }

        // Update the product quantity and log the state
        product.setQuantity(request.quantity());
        System.out.println("Updating product: " + product);

        // Save and publish the update
        try {
            Product updatedProduct = productRepository.save(product);
            // Publish real-time stock update via WebSocket to notify subscribed clients
            messagingTemplate.convertAndSend("/topic/stockUpdates", new StockUpdate(product.getId(), product.getQuantity()));
            return mapToProductResponse(updatedProduct);
        } catch (ConstraintViolationException e) {
            e.getConstraintViolations().forEach(violation -> System.err.println(violation.getMessage()));
            throw new RuntimeException("Validation error: " + e.getMessage());
        } catch (OptimisticLockException e) {
            throw new RuntimeException("Product was updated concurrently. Please try again.");
        }
    }

}
