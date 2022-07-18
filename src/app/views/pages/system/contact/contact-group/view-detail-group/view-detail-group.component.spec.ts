import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDetailGroupComponent } from './view-detail-group.component';

describe('ViewDetailGroupComponent', () => {
  let component: ViewDetailGroupComponent;
  let fixture: ComponentFixture<ViewDetailGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDetailGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDetailGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
