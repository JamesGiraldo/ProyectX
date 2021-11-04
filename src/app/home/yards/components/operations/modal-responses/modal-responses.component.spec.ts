import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResponsesComponent } from './modal-responses.component';

describe('ModalResponsesComponent', () => {
  let component: ModalResponsesComponent;
  let fixture: ComponentFixture<ModalResponsesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalResponsesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
