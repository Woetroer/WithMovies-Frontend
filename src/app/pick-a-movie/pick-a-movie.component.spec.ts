import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickAMovieComponent } from './pick-a-movie.component';

describe('PickAMovieComponent', () => {
  let component: PickAMovieComponent;
  let fixture: ComponentFixture<PickAMovieComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PickAMovieComponent]
    });
    fixture = TestBed.createComponent(PickAMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
