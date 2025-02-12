package com.example.ShopiShop.utils;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.UUID;


public class UUIDconvertor {
    public static UUID stringToUUID(String hexString) {
        if (hexString == null || hexString.isEmpty()) {
            throw new IllegalArgumentException("this hexstring is null"+hexString);
        }

        if (hexString.startsWith("0x")) {
            hexString = hexString.substring(2);
        }



        String formattedUUID = hexString.replaceFirst(
                "(\\w{8})(\\w{4})(\\w{4})(\\w{4})(\\w+)",
                "$1-$2-$3-$4-$5"
        );

        return UUID.fromString(formattedUUID);
    }

    public static UUID convertToUUID(String uuidString) {
        try {
            return UUID.fromString(uuidString);
        } catch (IllegalArgumentException e) {
            // Handle the case where the input string is not a valid UUID format
            System.out.println("Invalid UUID string: " + uuidString);
            return null;
        }
    }
}

