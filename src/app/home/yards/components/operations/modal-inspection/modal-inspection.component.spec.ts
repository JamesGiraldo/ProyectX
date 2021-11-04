import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInspectionComponent } from './modal-inspection.component';

describe('ModalInspectionComponent', () => {
  let component: ModalInspectionComponent;
  let fixture: ComponentFixture<ModalInspectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalInspectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalInspectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
