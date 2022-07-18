import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRewardDisciplineComponent } from './student-reward-discipline.component';

describe('StudentRewardDisciplineComponent', () => {
  let component: StudentRewardDisciplineComponent;
  let fixture: ComponentFixture<StudentRewardDisciplineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentRewardDisciplineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRewardDisciplineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
