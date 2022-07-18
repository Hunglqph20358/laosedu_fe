import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {TeacherRatingsComponent} from './teacher-ratings.component';

describe('CreateUpdateTeachersComponent', () => {
  let component: TeacherRatingsComponent;
  let fixture: ComponentFixture<TeacherRatingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherRatingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeacherRatingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
