package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.DiscountRequest;
import com.example.ShopiShop.dto.ProductRequest;
import com.example.ShopiShop.dto.ProductResponse;
import com.example.ShopiShop.dto.ReviewResponse;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.Category;
import com.example.ShopiShop.models.Product;
import com.example.ShopiShop.models.Review;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.repositories.CategoryRepository;
import com.example.ShopiShop.repositories.ProductRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

}
