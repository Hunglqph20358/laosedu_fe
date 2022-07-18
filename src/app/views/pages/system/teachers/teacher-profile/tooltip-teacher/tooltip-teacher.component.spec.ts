import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TooltipTeacherComponent } from './tooltip-teacher.component';

describe('TooltipTeacherComponent', () => {
  let component: TooltipTeacherComponent;
  let fixture: ComponentFixture<TooltipTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TooltipTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
