package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.ApiResponse;
import com.example.ShopiShop.dto.CategoryRequest;
import com.example.ShopiShop.dto.CategoryResponse;
import com.example.ShopiShop.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // ✅ Create Category (Admin Only)
    @PostMapping("/admin/category/create")
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    // ✅ Get All Categories (Public)
    @GetMapping("/public/category/all")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    // ✅ Get Category by ID (Public)
    @GetMapping("/public/category/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable UUID id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    // ✅ Get Categories by Section Name (Public)
    @GetMapping("/public/category/section/{sectionName}")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategoriesBySection(@PathVariable String sectionName) {
        return ResponseEntity.ok(categoryService.getCategoriesBySectionName(sectionName));
    }

    // ✅ Delete Category (Admin Only)
    @DeleteMapping("/admin/category/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable String sectionName) {
        return ResponseEntity.ok(categoryService.deleteCategory(sectionName));
    }
}
