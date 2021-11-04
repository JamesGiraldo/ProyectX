import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportValidationsComponent } from './report-validations.component';

describe('ReportValidationsComponent', () => {
  let component: ReportValidationsComponent;
  let fixture: ComponentFixture<ReportValidationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportValidationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportValidationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
