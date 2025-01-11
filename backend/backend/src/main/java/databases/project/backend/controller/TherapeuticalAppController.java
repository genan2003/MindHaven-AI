package databases.project.backend.controller;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import databases.project.backend.entity.TherapeuticApp;
import databases.project.backend.repository.TherapeuticalAppRepository;

@RestController
@RequestMapping("/api/apps")
public class TherapeuticalAppController {

    private final TherapeuticalAppRepository appRepository;
    private final RestTemplate restTemplate;

    private final String predictionApiUrl = "http://127.0.0.1:8000";

    public TherapeuticalAppController(TherapeuticalAppRepository appRepository, RestTemplate restTemplate) {
        this.appRepository = appRepository;
        this.restTemplate = restTemplate;
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
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
        }

        List<TherapeuticApp> apps = appRepository.findByResearcherUsername(principal.getName());

        // Call the prediction API for each app
        for (TherapeuticApp app : apps) {
            Integer views = app.getViews();
            String predictionUrl = predictionApiUrl + "/predict";
            
            // Prepare request body
            String requestBody = "{\"views\": [" + views + "]}";

            try {
                // Call the FastAPI prediction endpoint
                ResponseEntity<PredictionResponse> response = restTemplate.postForEntity(
                        predictionUrl, 
                        requestBody, 
                        PredictionResponse.class
                );

                if (response.getStatusCode() == HttpStatus.OK) {
                    app.setRecommended(response.getBody().isRecommended());
                    app.setProbability(response.getBody().getProbability());
                } else {
                    app.setRecommended(false);
                    app.setProbability(0.0);
                }
            } catch (Exception e) {
                System.err.println("Error calling prediction API for app " + app.getName() + ": " + e.getMessage());
                app.setRecommended(false);
                app.setProbability(0.0);
            }
        }

        return ResponseEntity.ok(apps);
    }

    @GetMapping("/{appId}")
    public ResponseEntity<?> getAppDetails(@PathVariable Integer appId) {
        Optional<TherapeuticApp> optionalApp = appRepository.findById(appId);

        if (optionalApp.isPresent()) {
            return ResponseEntity.ok(optionalApp.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("App not found");
        }
    }

    // Class to represent prediction response
    static class PredictionResponse {
        private boolean recommended;
        private double probability;

        // Getters and setters
        public boolean isRecommended() {
            return recommended;
        }

        public void setRecommended(boolean recommended) {
            this.recommended = recommended;
        }

        public double getProbability() {
            return probability;
        }

        public void setProbability(double probability) {
            this.probability = probability;
        }
    }
}
