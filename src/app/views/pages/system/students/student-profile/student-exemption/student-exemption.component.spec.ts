import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentExemptionComponent } from './student-exemption.component';

describe('StudentExemptionComponent', () => {
  let component: StudentExemptionComponent;
  let fixture: ComponentFixture<StudentExemptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentExemptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentExemptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
