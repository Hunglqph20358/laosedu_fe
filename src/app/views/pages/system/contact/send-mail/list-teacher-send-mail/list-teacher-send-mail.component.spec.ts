import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTeacherSendMailComponent } from './list-teacher-send-mail.component';

describe('ListTeacherSendMailComponent', () => {
  let component: ListTeacherSendMailComponent;
  let fixture: ComponentFixture<ListTeacherSendMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListTeacherSendMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListTeacherSendMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
