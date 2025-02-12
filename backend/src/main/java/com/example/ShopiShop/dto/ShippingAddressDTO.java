package com.example.ShopiShop.dto;

public record ShippingAddressDTO(
        String address1,
        String address2,
        String zipCode,
        String country,
        String city
) {}
