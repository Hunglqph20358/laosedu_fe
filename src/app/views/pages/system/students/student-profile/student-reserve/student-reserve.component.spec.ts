import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentReserveComponent } from './student-reserve.component';

describe('StudentReserveComponent', () => {
  let component: StudentReserveComponent;
  let fixture: ComponentFixture<StudentReserveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentReserveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentReserveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
