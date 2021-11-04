import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMassiveFieldsComponent } from './modal-massive-fields.component';

describe('ModalMassiveFieldsComponent', () => {
  let component: ModalMassiveFieldsComponent;
  let fixture: ComponentFixture<ModalMassiveFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMassiveFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMassiveFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
