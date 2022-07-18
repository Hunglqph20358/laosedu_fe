import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ScheduleTimetableComponent} from './schedule-timetable.component';

describe('CreateUpdateTeachersComponent', () => {
  let component: ScheduleTimetableComponent;
  let fixture: ComponentFixture<ScheduleTimetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTimetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
