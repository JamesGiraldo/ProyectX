import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalColumnsComponent } from './modal-columns.component';

describe('ModalColumnsComponent', () => {
  let component: ModalColumnsComponent;
  let fixture: ComponentFixture<ModalColumnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalColumnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalColumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
