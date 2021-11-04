import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewCustomFieldComponent } from './modal-new-custom-field.component';

describe('ModalNewCustomFieldComponent', () => {
  let component: ModalNewCustomFieldComponent;
  let fixture: ComponentFixture<ModalNewCustomFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewCustomFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewCustomFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
