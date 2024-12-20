package databases.project.backend.controller;

import databases.project.backend.dto.RegisterRequest;
import databases.project.backend.dto.LoginRequest;
import databases.project.backend.service.AuthService;
import databases.project.backend.security.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(AuthService authService, JwtTokenProvider jwtTokenProvider) {
        this.authService = authService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = jwtTokenProvider.authenticateAndGenerateToken(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(token);
    }
}
