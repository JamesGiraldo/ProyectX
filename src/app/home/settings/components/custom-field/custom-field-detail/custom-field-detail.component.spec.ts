import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFieldDetailComponent } from './custom-field-detail.component';

describe('CustomFieldDetailComponent', () => {
  let component: CustomFieldDetailComponent;
  let fixture: ComponentFixture<CustomFieldDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomFieldDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomFieldDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
