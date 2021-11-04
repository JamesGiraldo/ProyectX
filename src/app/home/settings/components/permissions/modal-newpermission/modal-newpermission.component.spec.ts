import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewpermissionComponent } from './modal-newpermission.component';

describe('ModalNewpermissionComponent', () => {
  let component: ModalNewpermissionComponent;
  let fixture: ComponentFixture<ModalNewpermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewpermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewpermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
