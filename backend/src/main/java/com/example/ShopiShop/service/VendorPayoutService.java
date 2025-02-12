package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.CreateVendorPayoutRequest;
import com.example.ShopiShop.dto.VendorPayoutDTO;

import java.util.List;

public interface VendorPayoutService {

    VendorPayoutDTO createPayout(CreateVendorPayoutRequest request);

    VendorPayoutDTO getPayout(Long id);

    List<VendorPayoutDTO> getAllPayouts();

    VendorPayoutDTO markAsPaid(Long id);

    // Add more methods if needed (e.g., update, list by store, etc.)
}
