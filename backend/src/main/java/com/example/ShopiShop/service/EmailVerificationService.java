package com.example.ShopiShop.service;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class EmailVerificationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String mailboxlayerApiKey = "YOUR_MAILBOXLAYER_API_KEY"; // Replace with your API key

    public boolean verifyWithMailboxlayer(String email) {
        String url = "http://apilayer.net/api/check?access_key=" + mailboxlayerApiKey + "&email=" + email;
        ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            // Example response fields: format_valid, smtp_check, and score.
            Boolean formatValid = (Boolean) response.getBody().get("format_valid");
            Boolean smtpCheck = (Boolean) response.getBody().get("smtp_check");
            return Boolean.TRUE.equals(formatValid) && Boolean.TRUE.equals(smtpCheck);
        }
        return false;
    }
}
