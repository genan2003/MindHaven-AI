package databases.project.backend.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import databases.project.backend.entity.User;
import databases.project.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PutMapping("/{username}/complete-profile")
    public ResponseEntity<?> completeProfile(
            @PathVariable String username, 
            @RequestBody Map<String, Object> profileData) {
        try {
            // Find user by username
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

            return ResponseEntity.ok("Profile updated and marked as completed.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error completing profile: " + e.getMessage());
        }
    }
}
