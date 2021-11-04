import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalVehiclesTimeComponent } from './modal-vehicles-time.component';

describe('ModalVehiclesTimeComponent', () => {
  let component: ModalVehiclesTimeComponent;
  let fixture: ComponentFixture<ModalVehiclesTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalVehiclesTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalVehiclesTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
