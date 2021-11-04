import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FareSubscriptionDetailComponent } from './fare-subscription-detail.component';

describe('FareSubscriptionDetailComponent', () => {
  let component: FareSubscriptionDetailComponent;
  let fixture: ComponentFixture<FareSubscriptionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FareSubscriptionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FareSubscriptionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
