import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnDeleteComponent } from './btn-delete.component';

describe('BtnDeleteComponent', () => {
  let component: BtnDeleteComponent;
  let fixture: ComponentFixture<BtnDeleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BtnDeleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
