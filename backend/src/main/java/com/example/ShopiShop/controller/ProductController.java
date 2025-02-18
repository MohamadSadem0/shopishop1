package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.service.ProductService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ✅ Create Product (Admin/Merchant Only)
    @PostMapping("/merchant/product/create")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductResponse response = productService.createProduct(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product created successfully", response));
    }

    // ✅ Get All Products (Public)
    @GetMapping("/public/product/all")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", products));
    }

    // ✅ Get Product by ID (Public)
    @GetMapping("/public/product/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable UUID id) {
        ProductResponse response = productService.getProductById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", response));
    }

    // ✅ Get Products by Store ID (Merchant Only)
    @GetMapping("/public/products/{storeId}")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByStoreId(@PathVariable Long storeId) {
        List<ProductResponse> products = productService.getProductsByStoreId(storeId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully for store ID: " + storeId, products));
    }

    // ✅ Delete Product (Admin/Merchant Only)
    @DeleteMapping("/admin/product/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product deleted successfully", null));
    }

    @GetMapping("/public/products")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getPaginatedProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category) {

        Page<ProductResponse> productPage = productService.getPaginatedProducts(page, size, category);
        return ResponseEntity.ok(new ApiResponse<>(true, "Products retrieved successfully", productPage));
    }
    @GetMapping("/public/product/name/{name}")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductByName(@PathVariable String name) {
        ProductResponse response = productService.getProductByName(name);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product retrieved successfully", response));
    }

    @GetMapping("/public/product/best-deals")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getBestDeals() {
        List<ProductResponse> bestDeals = productService.getBestDeals();
        return ResponseEntity.ok(new ApiResponse<>(true, "Best deals fetched successfully", bestDeals));
    }

    // ✅ 2) Featured Products
    @GetMapping("/public/product/featured")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getFeaturedProducts() {
        List<ProductResponse> featuredProducts = productService.getFeaturedProducts();
        return ResponseEntity.ok(new ApiResponse<>(true, "Featured products fetched successfully", featuredProducts));
    }

    @GetMapping("/public/product/best-selling")
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getBestSellingProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<ProductResponse> productPage = productService.getBestSellingProducts(page, size);
        return ResponseEntity.ok(
                new ApiResponse<>(true, "Best selling fetched successfully", productPage)
        );
    }

    // In ProductController
    @PostMapping("/merchant/product/apply-discount/{productId}")
    public ResponseEntity<ApiResponse<ProductResponse>> applyProductDiscount(
            @PathVariable UUID productId,
            @RequestBody DiscountRequest discountRequest // see below
    ) {
        ProductResponse updated = productService.applyDiscount(productId, discountRequest);
        return ResponseEntity.ok(new ApiResponse<>(true, "Discount applied", updated));
    }

    // Update Product (Admin/Merchant Only)
// Update Product (Admin/Merchant Only)
    @PutMapping("/merchant/product/update/{id}")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateRequest request) {
        ProductResponse response = productService.updateProduct(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Product updated successfully", response));
    }



}
