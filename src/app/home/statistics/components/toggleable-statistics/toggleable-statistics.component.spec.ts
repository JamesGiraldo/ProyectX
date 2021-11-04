import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleableStatisticsComponent } from './toggleable-statistics.component';

describe('ToggleableStatisticsComponent', () => {
  let component: ToggleableStatisticsComponent;
  let fixture: ComponentFixture<ToggleableStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleableStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleableStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
