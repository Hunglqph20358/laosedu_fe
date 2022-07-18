import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiligenceComponent } from './diligence.component';

describe('TeachersComponent', () => {
  let component: DiligenceComponent;
  let fixture: ComponentFixture<DiligenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiligenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
