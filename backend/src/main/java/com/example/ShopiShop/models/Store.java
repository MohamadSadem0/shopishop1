package com.example.ShopiShop.models;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "store")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_approved", nullable = false)
    private boolean isApproved;

    @Column(name = "location_id")
    private String locationId;

    @Column(name = "name", nullable = false)
    private String name;

    // Each store belongs to one owner (user)
    @OneToOne
    @JoinColumn(name = "owner_id", nullable = false, unique = true)
    private User owner;

    // If you have a Section entity, you can maintain that relationship
    @ManyToOne
    @JoinColumn(name = "section_id")
    private Section section;

    @Column(name = "address")
    private String address;

    @Column(name = "description")
    private String description;

    // Additional fields for multi-vendor operations
    @Column(name = "bank_account")
    private String bankAccount;

    @Column(name = "bank_routing")
    private String bankRouting;

    @Column(name = "business_license")
    private String businessLicense;

    @Column(name = "commission_rate", precision = 5, scale = 2)
    private BigDecimal commissionRate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    // A store can have many products
    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

}
