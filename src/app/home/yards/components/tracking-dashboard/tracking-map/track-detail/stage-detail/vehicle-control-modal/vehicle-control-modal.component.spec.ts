import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleControlModalComponent } from './vehicle-control-modal.component';

describe('VehicleControlModalComponent', () => {
  let component: VehicleControlModalComponent;
  let fixture: ComponentFixture<VehicleControlModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleControlModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleControlModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
