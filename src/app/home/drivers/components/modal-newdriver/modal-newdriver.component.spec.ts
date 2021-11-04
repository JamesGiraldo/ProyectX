import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewdriverComponent } from './modal-newdriver.component';

describe('ModalNewdriverComponent', () => {
  let component: ModalNewdriverComponent;
  let fixture: ComponentFixture<ModalNewdriverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewdriverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewdriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
