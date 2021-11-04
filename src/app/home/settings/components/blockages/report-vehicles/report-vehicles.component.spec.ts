import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVehiclesComponent } from './report-vehicles.component';

describe('ReportVehiclesComponent', () => {
  let component: ReportVehiclesComponent;
  let fixture: ComponentFixture<ReportVehiclesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportVehiclesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
