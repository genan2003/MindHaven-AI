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
  app!: TherapeuticalApp;
  reviews: Review[] = [];
  newReview: Review = {
    reviewId: 0,
    appId: 0,
    userId: 0,
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
    this.appId = +this.route.snapshot.paramMap.get('id')!;
    this.fetchAppDetails();
    this.fetchReviews();
  }

  fetchAppDetails(): void {
    this.appService.getAppById(this.appId).subscribe((data) => {
      this.app = data;
    });
  }

  fetchReviews(): void {
    this.reviewService.getReviewsByAppId(this.appId).subscribe((data) => {
      this.reviews = data;
    });
  }

  submitReview(): void {
    this.newReview.appId = this.appId;
    this.reviewService.addReview(this.appId, this.newReview).subscribe((data) => {
      this.reviews.push(data);
      this.newReview = { reviewId: 0, appId: 0, userId: 0, rating: 0, reviewText: '', createdAt: '' };
    });
  }
}
