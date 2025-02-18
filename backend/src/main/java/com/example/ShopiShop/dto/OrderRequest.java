package com.example.ShopiShop.dto;

import com.example.ShopiShop.enums.PaymentMethodEnum;

//
//
//public class OrderRequest {
//    private String shippingAddress;
//    private Double discountPrice;
//    private Object cart; // or a more specific type if you have one
//
//    private String contactNumber;
//    private String city;
//
//    // getters and setters
//    public String getShippingAddress() {
//        return shippingAddress;
//    }
//    public String getContactNumber() {
//        return contactNumber;
//    }
//
//    public String getCity(){return  city;}
//
//    public void setShippingAddress(String shippingAddress) {
//        this.shippingAddress = shippingAddress;
//    }
//
//    public Double getDiscountPrice() {
//        return discountPrice;
//    }
//
//    public void setDiscountPrice(Double discountPrice) {
//        this.discountPrice = discountPrice;
//    }
//
//    public Object getCart() {
//        return cart;
//    }
//
//    public void setCart(Object cart) {
//        this.cart = cart;
//    }
//}
public record OrderRequest(
        String shippingAddress,
        Double discountPrice,
        Object cart,
        String contactNumber,
        String city
) {}