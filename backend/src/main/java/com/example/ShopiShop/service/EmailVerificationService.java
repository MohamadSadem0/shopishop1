package com.example.ShopiShop.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class EmailVerificationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String mailboxlayerApiKey = "b634e50b34a938899e292a9c52fdc414";

    public boolean verifyWithMailboxlayer(String email) {
        String url = "http://apilayer.net/api/check?access_key=" + mailboxlayerApiKey + "&email=" + email;
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            // Log the response for debugging (remove or reduce logging in production)
            System.out.println("Mailboxlayer response: " + response.getBody());

            Boolean formatValid = (Boolean) response.getBody().get("format_valid");
            Boolean mxFound = (Boolean) response.getBody().get("mx_found");
            // Optionally, you could check smtp_check, but many valid emails might have it set to false.
            // Boolean smtpCheck = (Boolean) response.getBody().get("smtp_check");

            // Accept email if format is valid and MX records are found
            return Boolean.TRUE.equals(formatValid) && Boolean.TRUE.equals(mxFound);
        }
        return false;
    }
}
