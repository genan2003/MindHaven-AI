package databases.project.backend.security;

import io.jsonwebtoken.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {
    private final AuthenticationManager authenticationManager;
    private final String jwtSecret = "SecretKey"; // Use environment variable

    public JwtTokenProvider(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    public String authenticateAndGenerateToken(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        return Jwts.builder()
                .setSubject(authentication.getName())
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}