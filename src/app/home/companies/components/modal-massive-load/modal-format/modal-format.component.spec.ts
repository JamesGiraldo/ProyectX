import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFormatComponent } from './modal-format.component';

describe('ModalFormatComponent', () => {
  let component: ModalFormatComponent;
  let fixture: ComponentFixture<ModalFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
