package com.example.ShopiShop.service;

import com.example.ShopiShop.dto.CreateVendorPayoutRequest;
import com.example.ShopiShop.dto.VendorPayoutDTO;
import com.example.ShopiShop.enums.PayoutStatus;
import com.example.ShopiShop.models.Order;
import com.example.ShopiShop.models.Store;
import com.example.ShopiShop.models.VendorPayout;
import com.example.ShopiShop.repositories.OrderRepository;
import com.example.ShopiShop.repositories.StoreRepository;
import com.example.ShopiShop.repositories.VendorPayoutRepository;
import com.example.ShopiShop.service.VendorPayoutService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class VendorPayoutServiceImpl implements VendorPayoutService {

    private final VendorPayoutRepository vendorPayoutRepository;
    private final StoreRepository storeRepository;
    private final OrderRepository orderRepository;

    public VendorPayoutServiceImpl(
            VendorPayoutRepository vendorPayoutRepository,
            StoreRepository storeRepository,
            OrderRepository orderRepository
    ) {
        this.vendorPayoutRepository = vendorPayoutRepository;
        this.storeRepository = storeRepository;
        this.orderRepository = orderRepository;
    }
    @Override
    public VendorPayoutDTO createPayout(CreateVendorPayoutRequest request) {
        // 1. Fetch store
        Store store = storeRepository.findById(request.storeId())
                .orElseThrow(() -> new IllegalArgumentException("Store not found with ID " + request.storeId()));

        // 2. Fetch order
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found with ID " + request.orderId()));

        // 3. Build entity
        VendorPayout payout = VendorPayout.builder()
                .store(store)
                .order(order)
                .amountOwed(request.amountOwed())
                .commissionTaken(request.commissionTaken() != null ? request.commissionTaken() : null)
                .isPaid(false)
                .payoutStatus(PayoutStatus.PENDING.name())
                .createdAt(LocalDateTime.now())
                .build();

        // 4. Save
        VendorPayout saved = vendorPayoutRepository.save(payout);

        // 5. Convert to DTO
        return toDTO(saved);
    }

    @Override
    public VendorPayoutDTO getPayout(Long id) {
        VendorPayout payout = vendorPayoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found with ID " + id));
        return toDTO(payout);
    }

    @Override
    public List<VendorPayoutDTO> getAllPayouts() {
        return vendorPayoutRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @Override
    public VendorPayoutDTO markAsPaid(Long id) {
        VendorPayout payout = vendorPayoutRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found with ID " + id));

        // Mark as paid
        payout.setPaid(true);
        payout.setPayoutStatus(PayoutStatus.PAID.name());
        payout.setPaidAt(LocalDateTime.now());

        VendorPayout updated = vendorPayoutRepository.save(payout);
        return toDTO(updated);
    }

    // =========== Private Helpers ===========

    private VendorPayoutDTO toDTO(VendorPayout payout) {
        return new VendorPayoutDTO(
                payout.getId(),
                payout.getStore().getId(),
                payout.getOrder().getId(),
                payout.getAmountOwed(),
                payout.getCommissionTaken(),
                payout.isPaid(),
                payout.getPayoutStatus(),
                payout.getCreatedAt(),
                payout.getPaidAt()
        );
    }
}
