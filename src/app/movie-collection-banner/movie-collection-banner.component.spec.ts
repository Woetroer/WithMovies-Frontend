import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCollectionBannerComponent } from './movie-collection-banner.component';

describe('MovieCollectionBannerComponent', () => {
  let component: MovieCollectionBannerComponent;
  let fixture: ComponentFixture<MovieCollectionBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovieCollectionBannerComponent]
    });
    fixture = TestBed.createComponent(MovieCollectionBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
