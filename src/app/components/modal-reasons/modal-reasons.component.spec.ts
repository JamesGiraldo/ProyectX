import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalReasonsComponent } from './modal-reasons.component';

describe('ModalReasonsComponent', () => {
  let component: ModalReasonsComponent;
  let fixture: ComponentFixture<ModalReasonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalReasonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalReasonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
