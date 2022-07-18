import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {ModalImportComponent} from './modal-import.component';

describe('CreateUpdateTeachersComponent', () => {
  let component: ModalImportComponent;
  let fixture: ComponentFixture<ModalImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
