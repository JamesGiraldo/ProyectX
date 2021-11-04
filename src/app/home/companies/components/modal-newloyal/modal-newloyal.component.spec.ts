import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewloyalComponent } from './modal-newloyal.component';

describe('ModalNewloyalComponent', () => {
  let component: ModalNewloyalComponent;
  let fixture: ComponentFixture<ModalNewloyalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewloyalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewloyalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
