import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupActionComponent } from './group-action.component';

describe('GroupActionComponent', () => {
  let component: GroupActionComponent;
  let fixture: ComponentFixture<GroupActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
