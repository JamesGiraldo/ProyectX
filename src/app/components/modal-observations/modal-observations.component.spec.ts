import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalObservationsComponent } from './modal-observations.component';

describe('ModalObservationsComponent', () => {
  let component: ModalObservationsComponent;
  let fixture: ComponentFixture<ModalObservationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalObservationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalObservationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
