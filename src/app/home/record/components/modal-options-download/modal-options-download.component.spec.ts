import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOptionsDownloadComponent } from './modal-options-download.component';

describe('ModalOptionsDownloadComponent', () => {
  let component: ModalOptionsDownloadComponent;
  let fixture: ComponentFixture<ModalOptionsDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOptionsDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOptionsDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
