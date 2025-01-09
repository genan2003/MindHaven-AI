import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Review } from '../../models/review.model';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  imports: [FormsModule , CommonModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css'],
})
export class ReviewFormComponent {
  @Input() appId!: number; // Accepts the therapeutic app's ID as an input
  @Output() reviewAdded = new EventEmitter<void>(); // Emits an event after a review is successfully added

  review: Review = {
    rating: 0,
    reviewText: '',
    appId: 0,
  };

  errorMessage = '';

  constructor(private reviewService: ReviewService) {}

  submitReview(): void {
    if (this.review.rating <= 0 || this.review.rating > 5) {
      this.errorMessage = 'Rating must be between 1 and 5.';
      return;
    }

    this.review.appId = this.appId;

    this.reviewService.addReview(this.appId, this.review).subscribe(
      () => {
        this.reviewAdded.emit(); // Notify the parent component
        this.review = { rating: 0, reviewText: '', appId: this.appId }; // Reset the form
        this.errorMessage = '';
      },
      (error) => {
        this.errorMessage = 'Failed to submit review. Please try again later.';
      }
    );
  }
}
