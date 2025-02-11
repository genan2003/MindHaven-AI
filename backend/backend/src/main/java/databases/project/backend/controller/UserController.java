package databases.project.backend.controller;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import databases.project.backend.entity.User;
import databases.project.backend.repository.UserRepository;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Sample JWT secret key (replace this with your actual secret key)
    private final String SECRET_KEY = "IOPiC7A7rcUuD6gXxdXOucfQQ9Xo5TCBumYpHV+3I48YldnfVirfwR1PNirOAJxrp3psi5xVg/xMFiSSF+hE1fSAHjORbhoIk7QZdPVY5gw1Ta5i8MfFVQrfH/DbJ+p4pC8Ke5cU89ZiGL5r4W5NNCGk+7BLeMWloPAlIbnUVQcO";


    @PutMapping("/{username}/complete-profile")
    public ResponseEntity<?> completeProfile(
            @PathVariable String username,
            @RequestBody Map<String, Object> profileData,
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            // Extract token from the Authorization header
            String token = authorizationHeader.replace("Bearer ", "");
            
            // Parse the token and validate it
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();
            
            // You can now extract claims from the token
            String usernameFromToken = claims.getSubject();  // Get the username from the token

            // Ensure the username matches the token's username
            if (!usernameFromToken.equals(username)) {
                return ResponseEntity.status(403).body("Unauthorized to complete this profile.");
            }

            User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // Update user details
    if (profileData.containsKey("firstName")) {
        user.setFirstName((String) profileData.get("firstName"));
    }
    if (profileData.containsKey("lastName")) {
        user.setLastName((String) profileData.get("lastName"));
    }
    if (profileData.containsKey("age")) {
        user.setAge((Integer) profileData.get("age"));
    }
    if (profileData.containsKey("mentalHealthDisorder")) {
        user.setMentalHealthDisorder((String) profileData.get("mentalHealthDisorder"));
    }

    // Mark profile as completed
    user.setProfileCompleted(true);

    // Save updated user
    userRepository.save(user);
            // Find user, update profile, and return success response

            return ResponseEntity.ok("Profile updated and marked as completed.");
        } catch (Exception e) {
            // Catch any exceptions related to token parsing/validation
            return ResponseEntity.status(403).body("Invalid or expired token.");
        }
    }

    @PutMapping("/{username}/edit-profile")
    public ResponseEntity<?> editProfile(
            @PathVariable String username,
            @RequestBody Map<String, Object> profileData,
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            // Extract token from the Authorization header
            String token = authorizationHeader.replace("Bearer ", "");

            // Parse the token and validate it
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            String usernameFromToken = claims.getSubject();

            // Ensure the username matches the token's username
            if (!usernameFromToken.equals(username)) {
                return ResponseEntity.status(403).body("Unauthorized to edit this profile.");
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update user details only if they are not null or empty
            if (profileData.containsKey("firstName") && profileData.get("firstName") != null && !((String) profileData.get("firstName")).isEmpty()) {
                user.setFirstName((String) profileData.get("firstName"));
            }
            if (profileData.containsKey("lastName") && profileData.get("lastName") != null && !((String) profileData.get("lastName")).isEmpty()) {
                user.setLastName((String) profileData.get("lastName"));
            }
            if (profileData.containsKey("age") && profileData.get("age") != null) {
                Integer age = (Integer) profileData.get("age");
                if (age != null) {
                    user.setAge(age);
                }
            }
            if (profileData.containsKey("mentalHealthDisorder") && profileData.get("mentalHealthDisorder") != null && !((String) profileData.get("mentalHealthDisorder")).isEmpty()) {
                user.setMentalHealthDisorder((String) profileData.get("mentalHealthDisorder"));
            }

            // Save updated user
            userRepository.save(user);

            return ResponseEntity.ok("Profile successfully updated.");
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid or expired token.");
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Extract token from the Authorization header
            String token = authorizationHeader.replace("Bearer ", "");

            // Parse the token and validate it
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            String usernameFromToken = claims.getSubject();

            User user = userRepository.findByUsername(usernameFromToken)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Return user details
            return ResponseEntity.ok(user); // Send user data in response
        } catch (Exception e) {
            return ResponseEntity.status(403).body("Invalid or expired token.");
        }
    }
}