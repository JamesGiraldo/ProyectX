import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignamentTripsComponent } from './assignament-trips.component';

describe('AssignamentTripsComponent', () => {
  let component: AssignamentTripsComponent;
  let fixture: ComponentFixture<AssignamentTripsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignamentTripsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignamentTripsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
