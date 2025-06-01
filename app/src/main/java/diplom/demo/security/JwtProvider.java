package diplom.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtProvider {

    private final Key  key;
    private final long expirationMs;   // миллисекунды

    public JwtProvider(
            @Value("${app.jwt.secret}")     String secret,
            @Value("${app.jwt.expiration}") long   expirationMs
    ) {
        this.key          = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(String username, String role) {
        long  now = System.currentTimeMillis();
        Date  exp = new Date(now + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date(now))
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsername(String token) { return parse(token).getBody().getSubject(); }

    public String getRole(String token) {
        Object role = parse(token).getBody().get("role");
        return role == null ? "" : role.toString();
    }

    public boolean validate(String token) {
        try { parse(token); return true;}
        catch (JwtException e) { return false; }
    }

    /* ---------- helpers ---------- */
    private Jws<Claims> parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
    }
}
