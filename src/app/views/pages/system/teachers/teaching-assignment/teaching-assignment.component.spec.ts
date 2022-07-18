import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingAssignmentComponent } from './teaching-assignment.component';

describe('TeachingAssignmentComponent', () => {
  let component: TeachingAssignmentComponent;
  let fixture: ComponentFixture<TeachingAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TeachingAssignmentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
