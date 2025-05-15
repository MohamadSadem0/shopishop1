package com.example.ShopiShop.dto;

public record   StoreDetails(
        Long storeId,
        String storeName,
        String sectionName,
        String storeAddress,
        String storeDescription,
        String storeImage,
        boolean isApproved
) {}
