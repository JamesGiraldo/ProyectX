import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetailsFilesComponent } from './modal-details-files.component';

describe('ModalDetailsFilesComponent', () => {
  let component: ModalDetailsFilesComponent;
  let fixture: ComponentFixture<ModalDetailsFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalDetailsFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetailsFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
