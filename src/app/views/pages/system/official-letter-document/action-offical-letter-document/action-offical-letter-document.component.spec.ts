import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionOfficalLetterDocumentComponent } from './action-offical-letter-document.component';

describe('ActionOfficalLetterDocumentComponent', () => {
  let component: ActionOfficalLetterDocumentComponent;
  let fixture: ComponentFixture<ActionOfficalLetterDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionOfficalLetterDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionOfficalLetterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
