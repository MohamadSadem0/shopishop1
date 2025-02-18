package com.example.ShopiShop.security;
import com.example.ShopiShop.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    private final static String SECRET_KEY = "4a1684e3c328c385c8546fff6d46c79ef2d0581b98fff24bfd873e5c86d383d2";

    public String extractEmail(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract a specific claim from the token
    public <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    // Generate a token with user details and additional claims
    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getUserRole());
        return generateToken(claims, user);
    }

    public String generateToken(Map<String, Object> extraClaims, User user) {    
        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // 1 hour = 1000ms * 60 * 60
                .setExpiration(new Date(System.currentTimeMillis() + (100000 * 60 * 60)))
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    // Check if the token is valid
    public boolean isTokenValid(String token, User user) {
        final String email = extractEmail(token);
        System.out.println("Token email: " + email);
        System.out.println("User email: " + user.getEmail());
        return (email.equals(user.getEmail())) && !isTokenExpired(token);
    }


    // Check if the token has expired
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Extract expiration date from token
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extract all claims from the token
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Get the signing key for JWT
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
