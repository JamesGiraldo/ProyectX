import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPreviewFilesComponent } from './modal-preview-files.component';

describe('ModalPreviewFilesComponent', () => {
  let component: ModalPreviewFilesComponent;
  let fixture: ComponentFixture<ModalPreviewFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPreviewFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPreviewFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
