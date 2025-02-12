package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.ApiResponse;
import com.example.ShopiShop.dto.SectionRequest;
import com.example.ShopiShop.dto.SectionResponse;
import com.example.ShopiShop.dto.SectionWithCategoriesResponse;
import com.example.ShopiShop.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("")
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    // ✅ Create Section (Admin Only)
    @PostMapping("/admin/section/create")
    public ResponseEntity<?> createSection(@Valid @RequestBody SectionRequest request) {
        SectionResponse response = sectionService.createSection(request);
        return ResponseEntity.status(201).body(
                new ApiResponse<>(true, "Section created successfully", response)
        );
    }

    // ✅ Get All Sections (Public)
    @GetMapping("/public/sections")
    public ResponseEntity<?> getAllSections() {
        List<SectionResponse> sections = sectionService.getAllSections();
        return ResponseEntity.ok(new ApiResponse<>(true, "Sections retrieved successfully", sections));
    }

    // ✅ Get Section by ID (Public)
    @GetMapping("/public/section/{id}")
    public ResponseEntity<?> getSectionById(@PathVariable UUID id) {
        SectionResponse response = sectionService.getSectionById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Section retrieved successfully", response));
    }

    // ✅ Update Section (Admin Only)
    @PutMapping("/admin/section/{id}")
    public ResponseEntity<?> updateSection(@PathVariable UUID id, @Valid @RequestBody SectionRequest request) {
        SectionResponse response = sectionService.updateSection(id, request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Section updated successfully", response));
    }

    // ✅ Delete Section (Admin Only)
    @DeleteMapping("/admin/section/{id}")
    public ResponseEntity<?> deleteSection(@PathVariable UUID id) {
        sectionService.deleteSection(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Section deleted successfully", null));
    }


    // ✅ Get Sections with Categories (Public)
    @GetMapping("/public/sections-with-categories")
    public ResponseEntity<ApiResponse<List<SectionWithCategoriesResponse>>> getSectionsWithCategories() {
        return ResponseEntity.ok(sectionService.getAllSectionsWithCategories());
    }
}
