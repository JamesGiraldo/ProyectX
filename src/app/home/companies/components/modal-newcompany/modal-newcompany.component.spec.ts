import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewcompanyComponent } from './modal-newcompany.component';

describe('ModalNewcompanyComponent', () => {
  let component: ModalNewcompanyComponent;
  let fixture: ComponentFixture<ModalNewcompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewcompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewcompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
