import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewReportComponent } from './modal-new-report.component';

describe('ModalNewReportComponent', () => {
  let component: ModalNewReportComponent;
  let fixture: ComponentFixture<ModalNewReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
