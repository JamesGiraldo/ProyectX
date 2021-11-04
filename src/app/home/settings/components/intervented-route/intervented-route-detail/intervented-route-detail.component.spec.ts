import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventedRouteDetailComponent } from './intervented-route-detail.component';

describe('InterventedRouteDetailComponent', () => {
  let component: InterventedRouteDetailComponent;
  let fixture: ComponentFixture<InterventedRouteDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterventedRouteDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterventedRouteDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
