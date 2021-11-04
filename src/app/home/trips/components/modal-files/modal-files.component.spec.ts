import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFilesComponent } from './modal-files.component';

describe('ModalFilesComponent', () => {
  let component: ModalFilesComponent;
  let fixture: ComponentFixture<ModalFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
