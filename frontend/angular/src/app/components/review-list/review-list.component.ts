import { Component, Input, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-list',
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.css'],
})
export class ReviewListComponent implements OnInit {
  @Input() appId!: number; // Accepts the therapeutic app's ID as an input
  reviews: Review[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private reviewService: ReviewService) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.reviewService.getReviewsByAppId(this.appId).subscribe(
      (data) => {
        this.reviews = data;
        this.isLoading = false;
      },
      (error) => {
        this.errorMessage = 'Failed to load reviews. Please try again later.';
        this.isLoading = false;
      }
    );
  }
}
