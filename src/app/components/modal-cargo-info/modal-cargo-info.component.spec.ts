import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCargoInfoComponent } from './modal-cargo-info.component';

describe('ModalCargoInfoComponent', () => {
  let component: ModalCargoInfoComponent;
  let fixture: ComponentFixture<ModalCargoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCargoInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCargoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
