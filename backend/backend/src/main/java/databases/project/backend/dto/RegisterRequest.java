package databases.project.backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String role; // "USER" or "RESEARCHER"
    private Long institutionId; // Nullable if role is "USER"
}
