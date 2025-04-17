import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingPageComponent } from './matching-page.component';

describe('MatchingPageComponent', () => {
  let component: MatchingPageComponent;
  let fixture: ComponentFixture<MatchingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
