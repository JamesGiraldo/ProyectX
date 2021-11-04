import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOffersComponent } from './modal-offers.component';

describe('ModalOffersComponent', () => {
  let component: ModalOffersComponent;
  let fixture: ComponentFixture<ModalOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
