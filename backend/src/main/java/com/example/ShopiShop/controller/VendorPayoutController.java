package com.example.ShopiShop.controller;

import com.example.ShopiShop.dto.CreateVendorPayoutRequest;
import com.example.ShopiShop.dto.VendorPayoutDTO;
import com.example.ShopiShop.service.VendorPayoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/customer/vendor-payouts")
@RestController
public class VendorPayoutController {

    private final VendorPayoutService vendorPayoutService;

    public VendorPayoutController(VendorPayoutService vendorPayoutService) {
        this.vendorPayoutService = vendorPayoutService;
    }

    /**
     * Create a new VendorPayout
     */
    @PostMapping
    public ResponseEntity<VendorPayoutDTO> createVendorPayout(@RequestBody CreateVendorPayoutRequest request) {
        VendorPayoutDTO created = vendorPayoutService.createPayout(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * Retrieve a payout by its ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<VendorPayoutDTO> getVendorPayout(@PathVariable Long id) {
        VendorPayoutDTO dto = vendorPayoutService.getPayout(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * List all vendor payouts
     */
    @GetMapping
    public ResponseEntity<List<VendorPayoutDTO>> getAllVendorPayouts() {
        List<VendorPayoutDTO> payouts = vendorPayoutService.getAllPayouts();
        return ResponseEntity.ok(payouts);
    }

    /**
     * Mark a payout as paid
     */
    @PutMapping("/{id}/mark-paid")
    public ResponseEntity<VendorPayoutDTO> markPayoutAsPaid(@PathVariable Long id) {
        VendorPayoutDTO updated = vendorPayoutService.markAsPaid(id);
        return ResponseEntity.ok(updated);
    }
}
