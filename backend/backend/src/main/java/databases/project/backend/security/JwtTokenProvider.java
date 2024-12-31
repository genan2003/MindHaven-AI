package databases.project.backend.security;

import java.util.Date;
import java.util.function.Function;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtTokenProvider {

    private final AuthenticationManager authenticationManager;

    private final String jwtSecret = "IOPiC7A7rcUuD6gXxdXOucfQQ9Xo5TCBumYpHV+3I48YldnfVirfwR1PNirOAJxrp3psi5xVg/xMFiSSF+hE1fSAHjORbhoIk7QZdPVY5gw1Ta5i8MfFVQrfH/DbJ+p4pC8Ke5cU89ZiGL5r4W5NNCGk+7BLeMWloPAlIbnUVQcO";

    private final long jwtExpirationInMs = 3600000;

    private final UserDetailsService userDetailsService;

    public JwtTokenProvider(@Lazy AuthenticationManager authenticationManager, UserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public String authenticateAndGenerateToken(String username, String password) {
        try {
            System.out.println("Starting authentication for user: " + username);
    
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );
    
            System.out.println("Authentication successful for user: " + authentication.getName());
            return Jwts.builder()
                    .setSubject(authentication.getName())
                    .signWith(SignatureAlgorithm.HS512, jwtSecret)
                    .compact();
        } catch (Exception e) {
            System.err.println("Authentication failed for user " + username + ": " + e.getMessage());
            throw new RuntimeException("Authentication failed", e);
        }
    }
     public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Validate Token
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
            return false;
        }
    }

    public Authentication getAuthentication(String token) {
        try {
            // Parse the JWT token to extract the username (subject)
            String username = Jwts.parser()
                                  .setSigningKey(jwtSecret)
                                  .parseClaimsJws(token)
                                  .getBody()
                                  .getSubject();
    
            // Fetch UserDetails for the extracted username
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
    
            // Create an Authentication object using the UserDetails
            return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        } catch (Exception e) {
            System.err.println("Error getting authentication from token: " + e.getMessage());
            return null;
        }
    }
    

    // Extract username from token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // Extract any claim from token
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    // Extract all claims from token
    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token).getBody();
    }

        public String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
}
