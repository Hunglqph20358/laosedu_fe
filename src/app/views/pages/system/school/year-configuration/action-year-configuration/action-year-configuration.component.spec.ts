import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionYearConfigurationComponent } from './action-year-configuration.component';

describe('ActionYearConfigurationComponent', () => {
  let component: ActionYearConfigurationComponent;
  let fixture: ComponentFixture<ActionYearConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionYearConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionYearConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
