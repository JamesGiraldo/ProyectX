import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewvehicleComponent } from './modal-newvehicle.component';

describe('ModalNewvehicleComponent', () => {
  let component: ModalNewvehicleComponent;
  let fixture: ComponentFixture<ModalNewvehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewvehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewvehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
