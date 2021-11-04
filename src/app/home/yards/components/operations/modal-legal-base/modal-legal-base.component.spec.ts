import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalLegalBaseComponent } from './modal-legal-base.component';

describe('ModalLegalBaseComponent', () => {
  let component: ModalLegalBaseComponent;
  let fixture: ComponentFixture<ModalLegalBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalLegalBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalLegalBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
