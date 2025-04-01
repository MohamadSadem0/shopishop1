package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.models.User;
import com.example.ShopiShop.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ==================== PUBLIC ENDPOINTS ====================
    @GetMapping("/public/products")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllPublicProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", products));
    }

    @GetMapping("/public/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getPublicProductById(@PathVariable UUID id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", response));
    }

    @GetMapping("/public/products/store/{storeId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPublicProductsByStoreId(@PathVariable Long storeId) {
        List<ProductResponse> products = productService.getProductsByStoreId(storeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully for store", products));
    }

    @GetMapping("/public/products/search/{name}")
    public ResponseEntity<ApiResponse<ProductResponse>> searchPublicProductByName(@PathVariable String name) {
        ProductResponse response = productService.getProductByName(name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", response));
    }

    @GetMapping("/public/products/best-deals")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPublicBestDeals() {
        List<ProductResponse> bestDeals = productService.getBestDeals();
        return ResponseEntity.ok(new ApiResponse<>(true, "Best deals fetched successfully", bestDeals));
    }

    @GetMapping("/public/products/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPublicFeaturedProducts() {
        List<ProductResponse> featuredProducts = productService.getFeaturedProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured products fetched successfully", featuredProducts));
    }

    @GetMapping("/public/products/best-selling")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getPublicBestSellingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProductResponse> productPage = productService.getBestSellingProducts(page, size);
        return ResponseEntity.ok(new ApiResponse<>(true, "Best selling products fetched", productPage));
    }

    @GetMapping("/public/products/discounts/active")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPublicActiveDiscountProducts() {
        List<ProductResponse> products = productService.getProductsWithActiveDiscounts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Active discount products", products));
    }

    @GetMapping("/public/products/discounts/top")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getPublicTopDiscountProducts() {
        List<ProductResponse> products = productService.getTopDiscountProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Top discount products", products));
    }

    // ==================== CUSTOMER ENDPOINTS ====================
    @GetMapping("/customer/products/paginated")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getCustomerPaginatedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {
        Page<ProductResponse> productPage = productService.getPaginatedProducts(page, size, category);
        return ResponseEntity.ok(new ApiResponse<>(true, "Paginated products", productPage));
    }

    // ==================== MERCHANT ENDPOINTS ====================
    @PostMapping("/merchant/product/create")
    public ResponseEntity<ApiResponse<ProductResponse>> createMerchantProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", response));
    }

    @PutMapping("/merchant/products/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateMerchantProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", response));
    }

    @PutMapping("/merchant/products/{productId}/quantity")
    public ResponseEntity<ApiResponse<ProductResponse>> updateMerchantProductQuantity(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateProductQuantityRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            ProductResponse response = productService.updateProductQuantity(productId, request, currentUser);
            return ResponseEntity.ok(new ApiResponse<>(true, "Quantity updated successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Operation not permitted", null));
        }
    }

    @PostMapping("/merchant/products/{productId}/discounts")
    public ResponseEntity<ApiResponse<ProductResponse>> applyMerchantDiscount(
            @PathVariable UUID productId,
            @Valid @RequestBody DiscountRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            ProductResponse response = productService.applyDiscount(productId, request);
            return ResponseEntity.ok(new ApiResponse<>(true, "Discount applied successfully", response));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Operation not permitted: " + e.getMessage(), null));
        }
    }

    // ==================== ADMIN ENDPOINTS ====================
    @DeleteMapping("/admin/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAdminProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }

    @DeleteMapping("/admin/products/{productId}/discounts")
    public ResponseEntity<ApiResponse<Void>> removeAdminDiscount(@PathVariable UUID productId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            User currentUser = (User) authentication.getPrincipal();
            productService.removeDiscount(productId);
            return ResponseEntity.ok(new ApiResponse<>(true, "Discount removed successfully", null));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new ApiResponse<>(false, "Operation not permitted", null));
        }
    }


    @PostMapping("/merchant/discounts/bulk")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> applyBulkDiscounts(
            @RequestBody BulkDiscountRequest request) {
        try {
            List<ProductResponse> responses = productService.applyBulkDiscount(
                    request.productIds(),
                    request.discountRequest()
            );
            return ResponseEntity.ok(new ApiResponse<>(
                    true, "Bulk discounts applied", responses));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(
                    false, e.getMessage(), null));
        }
    }

    @GetMapping("/merchant/{storeId}/discounts/expiring-soon")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getExpiringDiscounts(
            @PathVariable Long storeId,
            @RequestParam(defaultValue = "7") int days) {
        List<ProductResponse> products = productService.getExpiringDiscounts(storeId, days);
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Expiring discounts retrieved", products));
    }
}