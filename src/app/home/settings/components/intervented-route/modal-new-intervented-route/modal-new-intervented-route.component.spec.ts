import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewInterventedRouteComponent } from './modal-new-intervented-route.component';

describe('ModalNewInterventedRouteComponent', () => {
  let component: ModalNewInterventedRouteComponent;
  let fixture: ComponentFixture<ModalNewInterventedRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewInterventedRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewInterventedRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
