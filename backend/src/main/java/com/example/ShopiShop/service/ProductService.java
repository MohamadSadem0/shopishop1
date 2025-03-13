package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.*;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

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
        // Map product reviews to ReviewResponse
        List<ReviewResponse> reviewResponses =
                product.getReviews() != null
                        ? product.getReviews().stream().map(this::mapToReviewResponse).toList()
                        : Collections.emptyList();


        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getImageUrl(),
                product.getCategory().getName(),
                product.getEffectivePrice(),
                product.getStore().getId(),
                product.getIsAvailable(),
                product.getStore().getName(),
                product.getQuantity(),
                reviewResponses
        );
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

    public ProductResponse applyDiscount(UUID productId, DiscountRequest discountRequest) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Not found"));

        product.setDiscountPrice(discountRequest.discountPrice());
        product.setDiscountPercent(discountRequest.discountPercent());
        product.setDiscountStartDate(discountRequest.discountStartDate());
        product.setDiscountEndDate(discountRequest.discountEndDate());

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
