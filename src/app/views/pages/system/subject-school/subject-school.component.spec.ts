import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSchoolComponent } from './subject-school.component';

describe('SubjectSchoolComponent', () => {
  let component: SubjectSchoolComponent;
  let fixture: ComponentFixture<SubjectSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
