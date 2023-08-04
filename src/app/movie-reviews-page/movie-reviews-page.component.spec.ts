import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieReviewsPageComponent } from './movie-reviews-page.component';

describe('MovieReviewsPageComponent', () => {
  let component: MovieReviewsPageComponent;
  let fixture: ComponentFixture<MovieReviewsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieReviewsPageComponent]
    });
    fixture = TestBed.createComponent(MovieReviewsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
