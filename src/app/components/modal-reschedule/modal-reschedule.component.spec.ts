import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRescheduleComponent } from './modal-reschedule.component';

describe('ModalRescheduleComponent', () => {
  let component: ModalRescheduleComponent;
  let fixture: ComponentFixture<ModalRescheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalRescheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRescheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
