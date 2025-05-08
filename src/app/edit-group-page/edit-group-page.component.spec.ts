import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditGroupPageComponent } from './edit-group-page.component';

describe('EditGroupPageComponent', () => {
  let component: EditGroupPageComponent;
  let fixture: ComponentFixture<EditGroupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditGroupPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditGroupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
