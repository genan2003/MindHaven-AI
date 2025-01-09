package databases.project.backend.controller;

import databases.project.backend.entity.Review;
import databases.project.backend.repository.ReviewRepository;
import databases.project.backend.repository.TherapeuticalAppRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final TherapeuticalAppRepository appRepository;

    public ReviewController(ReviewRepository reviewRepository, TherapeuticalAppRepository appRepository) {
        this.reviewRepository = reviewRepository;
        this.appRepository = appRepository;
    }

    // Add a review
    @PostMapping("/{appId}")
    public ResponseEntity<?> addReview(@PathVariable Long appId, @RequestBody Review review, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }

        // Check if the app exists
        if (!appRepository.existsById(appId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("App not found");
        }

        // Set the app ID and user ID
        review.setAppId(appId);
        review.setUserId(Long.parseLong(principal.getName())); // Assuming user ID is stored in Principal
        Review savedReview = reviewRepository.save(review);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    }

    // Get reviews for an app
    @GetMapping("/{appId}")
    public ResponseEntity<?> getReviewsForApp(@PathVariable Long appId) {
        if (!appRepository.existsById(appId)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("App not found");
        }

        List<Review> reviews = reviewRepository.findByAppId(appId);
        return ResponseEntity.ok(reviews);
    }

    // Delete a review (for authorized users)
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized");
        }

        Optional<Review> reviewOptional = reviewRepository.findById(reviewId);
        if (reviewOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found");
        }

        Review review = reviewOptional.get();
        if (!review.getUserId().equals(Integer.parseInt(principal.getName()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only delete your own reviews");
        }

        reviewRepository.deleteById(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}
