package com.example.ShopiShop.dto;


public record OrderRequest(
        String shippingAddress,
        Double discountPrice,
        Object cart,
        String contactNumber,
        String city
) {}