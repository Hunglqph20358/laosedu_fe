import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInfomationComponent } from './student-infomation.component';

describe('StudentInfomationComponent', () => {
  let component: StudentInfomationComponent;
  let fixture: ComponentFixture<StudentInfomationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentInfomationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentInfomationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
