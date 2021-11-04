import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMassiveLoadComponent } from './modal-massive-load.component';

describe('ModalMassiveLoadComponent', () => {
  let component: ModalMassiveLoadComponent;
  let fixture: ComponentFixture<ModalMassiveLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalMassiveLoadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalMassiveLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
