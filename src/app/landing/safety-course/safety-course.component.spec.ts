import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyCourseComponent } from './safety-course.component';

describe('SafetyCourseComponent', () => {
  let component: SafetyCourseComponent;
  let fixture: ComponentFixture<SafetyCourseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SafetyCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafetyCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
