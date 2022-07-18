import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferStudentNotifyComponent } from './transfer-student-notify.component';

describe('TransferStudentNotifyComponent', () => {
  let component: TransferStudentNotifyComponent;
  let fixture: ComponentFixture<TransferStudentNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferStudentNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferStudentNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
