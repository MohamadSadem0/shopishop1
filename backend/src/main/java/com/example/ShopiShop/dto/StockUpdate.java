package com.example.ShopiShop.dto;

import java.util.UUID;

public class StockUpdate {
    private UUID productId;
    private Integer quantity;

    public StockUpdate(UUID productId, Integer quantity) {
        this.productId = productId;
        this.quantity = quantity;
    }

    // Getters and setters
    public UUID getProductId() {
        return productId;
    }
    public void setProductId(UUID productId) {
        this.productId = productId;
    }
    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
