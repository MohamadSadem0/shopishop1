package com.example.ShopiShop.repositories;

import com.example.ShopiShop.models.VendorPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorPayoutRepository extends JpaRepository<VendorPayout, Long> {

    // Example custom query if you want to find by store ID
    List<VendorPayout> findByStoreId(Long storeId);

    // Example custom query if you want to find payouts by payout status
    List<VendorPayout> findByPayoutStatus(String payoutStatus);
}
