package databases.project.backend.controller;

import databases.project.backend.entity.Review;
import databases.project.backend.entity.User;
import databases.project.backend.repository.ReviewRepository;
import databases.project.backend.repository.TherapeuticalAppRepository;
import databases.project.backend.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TherapeuticalAppRepository appRepository;
    private UserRepository userRepository;

    public ReviewController(ReviewRepository reviewRepository, TherapeuticalAppRepository appRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.appRepository = appRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        System.out.println("here");
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null); // Not logged in
        }

        // Assuming the principal is tied to the authenticated user
        Optional<User> currentUser = userRepository.findByUsername(principal.getName());
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // User not found
        }

        return ResponseEntity.ok(currentUser.get()); // Return current user details
    }

    // Add a review
    @PostMapping("/{appId}")
    public ResponseEntity<?> addReview(@PathVariable Long appId, @RequestBody Review review, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }

        // Fetch user by username (from principal)
        Optional<User> userOptional = userRepository.findByUsername(principal.getName());
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        User user = userOptional.get();
        Long userId = user.getUserId();

        // Check if the app exists
        if (!appRepository.existsById(appId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("App not found");
        }

        if (reviewRepository.existsByAppIdAndUserId(appId, userId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("You have already submitted a review for this app.");
        }

        // Set the app ID and user ID for the review
        review.setAppId(appId);
        review.setUserId(userId);
        review.setReviewId(null);
        reviewRepository.save(review);

        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping("/{appId}/has-reviewed")
    public ResponseEntity<Boolean> hasReviewed(@PathVariable Long appId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(false);
        }

        Optional<User> user = userRepository.findByUsername(principal.getName());
        Long userId = user.get().getUserId(); 
        boolean hasReviewed = reviewRepository.existsByAppIdAndUserId(appId, userId);

        return ResponseEntity.ok(hasReviewed);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, Principal principal) {
        Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found"));
        
        // Ensure the user is deleting their own review
        Optional<User> user = userRepository.findByUsername(principal.getName());
        Long userId = user.get().getUserId(); 
        if (!review.getUserId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized to delete this review");
        }

        reviewRepository.delete(review);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Get reviews for an app
    @GetMapping("/{appId}")
    public ResponseEntity<?> getReviewsForApp(@PathVariable Long appId, @RequestParam Long loggedInUserId) {
        if (!appRepository.existsById(appId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("App not found");
        }

        List<Review> reviews = reviewRepository.findByAppId(appId);
        for (Review review : reviews) {
            Optional<User> userOptional = userRepository.findById(review.getUserId());
            if (userOptional.isPresent()) {
                String username = userOptional.get().getUsername();

                // If the review's userId matches the logged-in user, display the full username
                if (review.getUserId().equals(loggedInUserId)) {
                    review.setUsername(username);} 
                else {
                    // Mask username if the user is not the logged-in user
                    if (username.length() >= 3) {
                        review.setUsername(username.substring(0, 3) + "***");  // Mask username for others
                    } else {
                        review.setUsername(username + "***");  // Mask username for others
                    }
                }
            }
        }

        return ResponseEntity.ok(reviews);
    }


}
