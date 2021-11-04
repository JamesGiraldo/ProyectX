import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YardDetailComponent } from './yard-detail.component';

describe('YardDetailComponent', () => {
  let component: YardDetailComponent;
  let fixture: ComponentFixture<YardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
