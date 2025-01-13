package databases.project.backend.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import databases.project.backend.dto.LoginRequest;
import databases.project.backend.dto.RegisterRequest;
import databases.project.backend.entity.Role;
import databases.project.backend.entity.User;
import databases.project.backend.repository.UserRepository;
import databases.project.backend.security.JwtTokenProvider;
import databases.project.backend.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, JwtTokenProvider jwtTokenProvider,
                          UserRepository userRepository) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User registeredUser = authService.register(request);

        if (Role.USER.equals(registeredUser.getRole())) {
            // Role-specific redirection logic for USERS
            return ResponseEntity.ok("User registered successfully! Please log in and complete your profile.");
        }

        // For other roles like RESEARCHER
        return ResponseEntity.ok("User registered successfully!");
    }

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    try {
        // Log incoming request
        System.out.println("Login attempt for username: " + request.getUsername());
        System.out.println("Password for user " + request.getUsername() + ": " + request.getPassword());

        // Authenticate and generate token
        String token = jwtTokenProvider.authenticateAndGenerateToken(request.getUsername(), request.getPassword());
        System.out.println("Token generated successfully");

        // Fetch user by username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("User found: " + user.getUsername() + ", Role: " + user.getRole());

        // Prepare JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("profileCompleted", user.getProfileCompleted());
        response.put("role", user.getRole());

        return ResponseEntity.ok(response); // Return response as JSON
    } catch (Exception e) {
        System.err.println("Error during login: " + e.getMessage());

        // Prepare error response
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", "Invalid credentials");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    
}

@PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Here we don't need to do much since the token is stored on the client-side.
        // The client just needs to remove the token from storage.
        return ResponseEntity.ok("Logged out successfully");
    }

    

@PutMapping("/{username}/complete-profile")
public ResponseEntity<?> completeProfile(
        @PathVariable String username,
        @RequestBody Map<String, Object> profileData,
        Principal principal) {
    try {
        System.out.println("Authenticated user: " + (principal != null ? principal.getName() : "null"));
        System.out.println("Request to complete profile for username: " + username);

        // Validate authentication and authorization
        if (principal == null || !principal.getName().equals(username)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: Unauthorized user");
        }

        System.out.println("Principal name: " + (principal != null ? principal.getName() : "null"));

        // Fetch user from the database
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update user fields
        user.setProfileCompleted(true);

        // Add more fields as needed

        userRepository.save(user); // Save updated user

        System.out.println("Profile updated successfully for user: " + username);
        return ResponseEntity.ok("Profile updated successfully");
    } catch (Exception e) {
        System.err.println("Error completing profile for user " + username + ": " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("An error occurred while completing the profile");
    }
}






}
