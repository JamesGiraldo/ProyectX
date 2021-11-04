import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventedRouteComponent } from './intervented-route.component';

describe('InterventedRouteComponent', () => {
  let component: InterventedRouteComponent;
  let fixture: ComponentFixture<InterventedRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventedRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventedRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
