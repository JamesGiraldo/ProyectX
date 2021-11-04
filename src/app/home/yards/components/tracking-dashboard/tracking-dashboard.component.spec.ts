import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackingDashboardComponent } from './tracking-dashboard.component';

describe('TrackingDashboardComponent', () => {
  let component: TrackingDashboardComponent;
  let fixture: ComponentFixture<TrackingDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackingDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
