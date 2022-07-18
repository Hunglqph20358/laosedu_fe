import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSchoolComponent } from './configuration-school.component';

describe('ConfigurationSchoolComponent', () => {
  let component: ConfigurationSchoolComponent;
  let fixture: ComponentFixture<ConfigurationSchoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationSchoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
