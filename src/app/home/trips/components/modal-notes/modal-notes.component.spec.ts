import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNotesComponent } from './modal-notes.component';

describe('ModalNotesComponent', () => {
  let component: ModalNotesComponent;
  let fixture: ComponentFixture<ModalNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
