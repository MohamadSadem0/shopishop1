package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.*;
import com.example.ShopiShop.exceptions.SectionAlreadyExistsException;
import com.example.ShopiShop.models.Section;
import com.example.ShopiShop.repositories.SectionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SectionService {

    private final SectionRepository sectionRepository;

    public SectionResponse createSection(SectionRequest request) {
        sectionRepository.findByName(request.name()).ifPresent(s -> {
            throw new SectionAlreadyExistsException();
        });

        Section section = Section.builder()
                .name(request.name())
                .imageUrl(request.imageUrl())
                .build();

        Section savedSection = sectionRepository.save(section);

        return new SectionResponse(savedSection.getId(), savedSection.getName(), savedSection.getImageUrl());
    }

    public List<SectionResponse> getAllSections() {
        return sectionRepository.findAll()
                .stream()
                .map(section -> new SectionResponse(section.getId(), section.getName(), section.getImageUrl()))
                .toList();
    }

    public SectionResponse getSectionById(UUID id) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Section not found"));
        return new SectionResponse(section.getId(), section.getName(), section.getImageUrl());
    }

    public SectionResponse updateSection(UUID id, SectionRequest request) {
        Section section = sectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Section not found"));

        section.setName(request.name());
        section.setImageUrl(request.imageUrl());

        Section updatedSection = sectionRepository.save(section);
        return new SectionResponse(updatedSection.getId(), updatedSection.getName(), updatedSection.getImageUrl());
    }

    public void deleteSection(UUID id) {
        sectionRepository.deleteById(id);
    }

    public ApiResponse<List<SectionWithCategoriesResponse>> getAllSectionsWithCategories() {
        List<SectionWithCategoriesResponse> sections = sectionRepository.findAll().stream()
                .map(section -> new SectionWithCategoriesResponse(
                        section.getId(),
                        section.getName(),
                        section.getImageUrl(),
                        section.getCategories().stream()
                                .map(category -> new CategoryResponse(
                                        category.getId(),
                                        category.getName(),
                                        category.getImageUrl(),
                                        category.getSection().getId()
                                )).toList()
                ))
                .toList();

        if (sections.isEmpty()) {
            return new ApiResponse<>(true, "No sections found", List.of());
        }

        return new ApiResponse<>(true, "Sections with categories retrieved successfully", sections);
    }
}
