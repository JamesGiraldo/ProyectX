import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulesDetailComponent } from './schedules-detail.component';

describe('SchedulesDetailComponent', () => {
  let component: SchedulesDetailComponent;
  let fixture: ComponentFixture<SchedulesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchedulesDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
