import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YearConfigurationComponent } from './year-configuration.component';

describe('YearConfigurationComponent', () => {
  let component: YearConfigurationComponent;
  let fixture: ComponentFixture<YearConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YearConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YearConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
