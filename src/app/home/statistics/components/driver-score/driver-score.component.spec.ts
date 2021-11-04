import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverScoreComponent } from './driver-score.component';

describe('DriverScoreComponent', () => {
  let component: DriverScoreComponent;
  let fixture: ComponentFixture<DriverScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DriverScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
