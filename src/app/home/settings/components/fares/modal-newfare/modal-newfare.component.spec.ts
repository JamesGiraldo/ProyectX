import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewfareComponent } from './modal-newfare.component';

describe('ModalNewfareComponent', () => {
  let component: ModalNewfareComponent;
  let fixture: ComponentFixture<ModalNewfareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewfareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewfareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
