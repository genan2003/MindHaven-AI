package databases.project.backend.repository;

import databases.project.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAppIdAndUserId(Long appId, Long userId);

    // Find all reviews for a specific app
    List<Review> findByAppId(Long appId);

    // Check if a review exists by its ID
    boolean existsById(Long reviewId);

    // Optional: Find a review by its ID (if needed separately)
    Optional<Review> findById(Long reviewId);

    // Get the average rating for a specific app
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.appId = :appId")
    Double findAverageRatingByAppId(@Param("appId") Integer appId);

    // Count the number of reviews for a specific app
    @Query("SELECT COUNT(r) FROM Review r WHERE r.appId = :appId")
    Long countReviewsByAppId(@Param("appId") Integer appId);
}
