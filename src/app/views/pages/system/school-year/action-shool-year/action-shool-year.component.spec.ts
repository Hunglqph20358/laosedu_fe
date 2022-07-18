mport { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionShoolComponent } from './action-shool-year.component';

describe('ActionShoolComponent', () => {
  let component: ActionShoolComponent;
  let fixture: ComponentFixture<ActionShoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionShoolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionShoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
