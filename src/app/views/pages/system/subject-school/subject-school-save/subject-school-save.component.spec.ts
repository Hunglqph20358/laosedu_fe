import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectSchoolSaveComponent } from './subject-school-save.component';

describe('SubjectSchoolSaveComponent', () => {
  let component: SubjectSchoolSaveComponent;
  let fixture: ComponentFixture<SubjectSchoolSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectSchoolSaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectSchoolSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
