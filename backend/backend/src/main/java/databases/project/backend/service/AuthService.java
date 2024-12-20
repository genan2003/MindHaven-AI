package databases.project.backend.service;

import databases.project.backend.dto.RegisterRequest;
import databases.project.backend.entity.User;
import databases.project.backend.entity.Role;
import databases.project.backend.repository.UserRepository;
import databases.project.backend.repository.InstitutionRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final InstitutionRepository institutionRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, InstitutionRepository institutionRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.institutionRepository = institutionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole()));

        if (Role.RESEARCHER.equals(user.getRole())) {
            user.setInstitution(institutionRepository.findById(request.getInstitutionId())
                    .orElseThrow(() -> new RuntimeException("Institution not found")));
        }

        return userRepository.save(user);
    }
}
