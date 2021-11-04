import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMassiveFareComponent } from './modal-massive-fare.component';

describe('ModalMassiveFareComponent', () => {
  let component: ModalMassiveFareComponent;
  let fixture: ComponentFixture<ModalMassiveFareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMassiveFareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMassiveFareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
