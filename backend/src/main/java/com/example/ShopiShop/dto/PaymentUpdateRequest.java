package com.example.ShopiShop.dto;


import com.example.ShopiShop.enums.PaymentMethodEnum;

public record PaymentUpdateRequest(
        PaymentMethodEnum paymentMethod
) {}
