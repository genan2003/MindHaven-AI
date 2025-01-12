import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TherapeuticalApp } from '../../models/therapeutical-app.model';
import { Review } from '../../models/review.model';
import { TherapeuticAppService } from '../../services/therapeutic-app.service';
import { ReviewService } from '../../services/review.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-detail',
  templateUrl: './app-detail.component.html',
  imports: [FormsModule, CommonModule],
  styleUrls: ['./app-detail.component.css']
})
export class AppDetailComponent implements OnInit {
  appId!: number;
  canSubmitReview = true;
  errorMessage = '';
  app!: TherapeuticalApp;
  reviews: Review[] = [];
  loggedInUserId = undefined; // Replace with logic to get the logged-in user ID
  newReview: Review = {
    reviewId: 0,
    appId: 0,
    userId: 0,
    username: '',
    rating: 0,
    reviewText: '',
    createdAt: ''
  };

  constructor(
    private route: ActivatedRoute,
    private appService: TherapeuticAppService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.appId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchAppDetails();
    this.checkIfUserCanSubmitReview();
  }

  getUser(): void {
    this.reviewService.getLoggedInUser().subscribe(
      (user) => {
        this.loggedInUserId = user?.userId;
        console.log('User details fetched:', user);
        console.log('Logged in user ID:', this.loggedInUserId);
  
        // Fetch reviews only after user ID is retrieved
        this.fetchReviews();
        this.checkIfUserCanSubmitReview();
      },
      (error) => {
        console.error('Error fetching user details', error);
        this.errorMessage = 'Unable to fetch user details.';
      }
    );
  }
  

  checkIfUserCanSubmitReview(): void {
    this.reviewService.hasUserReviewed(this.appId).subscribe(
      (hasReviewed) => {
        this.canSubmitReview = !hasReviewed;
      },
      (error) => {
        this.errorMessage = 'Unable to check review status.';
      }
    );
  }

  fetchAppDetails(): void {
    this.appService.getAppById(this.appId).subscribe(
      (data) => {
        this.app = data;
      },
      (error) => {
        console.error('Failed to fetch app details:', error);
      }
    );
  }

  fetchReviews(): void {
    this.reviewService.getReviewsByAppId(this.appId, this.loggedInUserId!).subscribe(
      (data) => {
        console.log('Fetched reviews:', data);
        this.reviews = data;
      },
      (error) => {
        console.error('Failed to fetch reviews:', error);
      }
    );
  }

  submitReview(): void {
  this.newReview.appId = this.appId;
  this.newReview.userId = this.loggedInUserId;

  if (!this.loggedInUserId) {
    alert('Please log in before submitting a review.');
    return;
  }

  if (!this.canSubmitReview) {
    alert('You have already submitted a review for this app.');
    return;
  }

  // Get the username from local storage or a user service
  const username = localStorage.getItem('username');  // Assuming 'username' is stored in local storage

  if (!username) {
    alert('Username not found. Please log in.');
    return;
  }

  // Add the username to the review object
  this.newReview.username = username;

  console.log('Submitting review:', this.newReview); // Log newReview before sending to backend

  this.reviewService.addReview(this.appId, this.newReview).subscribe(
    (data) => {
      console.log('Received data:', data);
      if (data) {
        this.reviews.push(data);  // Add the new review to the list
        this.canSubmitReview = false;
        this.newReview = { reviewId: 0, appId: 0, userId: 0, username: '', rating: 0, reviewText: '', createdAt: '' }; // Reset form fields
      } else {
        console.error('No data returned from the API');
      }
    },
    (error) => {
      console.error('Error while submitting review:', error);
    }
  );
}


  deleteReview(reviewId: number): void {
    this.reviewService.deleteReview(reviewId).subscribe(
      () => {
        this.reviews = this.reviews.filter((review) => review.reviewId !== reviewId);
        this.canSubmitReview = true;
      },
      (error) => {
        console.error('Failed to delete review:', error);
      }
    );
  }
}
