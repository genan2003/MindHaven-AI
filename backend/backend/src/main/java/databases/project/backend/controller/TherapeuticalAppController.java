package databases.project.backend.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import databases.project.backend.entity.TherapeuticApp;
import databases.project.backend.repository.TherapeuticalAppRepository;

@RestController
@RequestMapping("/api/apps")
public class TherapeuticalAppController {

    private final TherapeuticalAppRepository appRepository;

    public TherapeuticalAppController(TherapeuticalAppRepository appRepository) {
        this.appRepository = appRepository;
    }

    @PostMapping
    public ResponseEntity<?> createApp(@RequestBody TherapeuticApp app, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        app.setResearcherUsername(principal.getName());
        TherapeuticApp savedApp = appRepository.save(app);
        return ResponseEntity.ok(savedApp);
    }

    @GetMapping
    public ResponseEntity<List<TherapeuticApp>> getApps(Principal principal) {
        if (principal == null) {
            System.out.println("Principal is null - user not authenticated");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }
    
        System.out.println("Fetching apps for user: " + principal.getName());
        List<TherapeuticApp> apps = appRepository.findByResearcherUsername(principal.getName());
        System.out.println("Apps fetched: " + apps.size());
        return ResponseEntity.ok(apps);
    }
    

}
