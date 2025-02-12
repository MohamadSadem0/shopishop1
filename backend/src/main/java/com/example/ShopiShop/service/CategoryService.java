package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.ApiResponse;
import com.example.ShopiShop.dto.CategoryRequest;
import com.example.ShopiShop.dto.CategoryResponse;
import com.example.ShopiShop.exceptions.ResourceNotFoundException;
import com.example.ShopiShop.models.Category;
import com.example.ShopiShop.models.Section;
import com.example.ShopiShop.repositories.CategoryRepository;
import com.example.ShopiShop.repositories.SectionRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SectionRepository sectionRepository;

    @Transactional
    public ApiResponse<CategoryResponse> createCategory(@Valid CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            return new ApiResponse<>(false, "Category with this name already exists", null);
        }

        Section section = sectionRepository.findByName(request.sectionName())
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        Category category = Category.builder()
                .id(UUID.randomUUID())
                .name(request.name())
                .imageUrl(request.imageUrl())
                .section(section)
                .build();

        Category savedCategory = categoryRepository.save(category);

        return new ApiResponse<>(true, "Category created successfully",
                new CategoryResponse(
                        savedCategory.getId(),
                        savedCategory.getName(),
                        savedCategory.getImageUrl(),
                        section.getId()
                ));
    }

    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        List<CategoryResponse> categories = categoryRepository.findAll().stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getImageUrl(),
                        category.getSection().getId()
                ))
                .toList();

        if (categories.isEmpty()) {
            return new ApiResponse<>(true, "No categories found", List.of());
        }

        return new ApiResponse<>(true, "Categories retrieved successfully", categories);
    }

    public ApiResponse<CategoryResponse> getCategoryById(UUID id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        return new ApiResponse<>(true, "Category retrieved successfully",
                new CategoryResponse(category.getId(), category.getName(),
                        category.getImageUrl(), category.getSection().getId()));
    }

    // ✅ Fetch Categories by Section Name
    public ApiResponse<List<CategoryResponse>> getCategoriesBySectionName(String sectionName) {
        Section section = sectionRepository.findByName(sectionName)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));

        List<CategoryResponse> categories = categoryRepository.findBySection(section).stream()
                .map(category -> new CategoryResponse(
                        category.getId(),
                        category.getName(),
                        category.getImageUrl(),
                        category.getSection().getId()
                ))
                .toList();

        if (categories.isEmpty()) {
            return new ApiResponse<>(true, "No categories found for this section", List.of());
        }

        return new ApiResponse<>(true, "Categories retrieved successfully", categories);
    }

    @Transactional
    public ApiResponse<Void> deleteCategory(String categoryName) {
        if (!categoryRepository.existsByName(categoryName)) {
            return new ApiResponse<>(false, "Category not found", null);
        }
        categoryRepository.deleteByName(categoryName);
        return new ApiResponse<>(true, "Category deleted successfully", null);
    }
}
