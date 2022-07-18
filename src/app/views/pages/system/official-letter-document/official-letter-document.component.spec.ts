import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficialLetterDocumentComponent } from './official-letter-document.component';

describe('OfficialLetterDocumentComponent', () => {
  let component: OfficialLetterDocumentComponent;
  let fixture: ComponentFixture<OfficialLetterDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficialLetterDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficialLetterDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
