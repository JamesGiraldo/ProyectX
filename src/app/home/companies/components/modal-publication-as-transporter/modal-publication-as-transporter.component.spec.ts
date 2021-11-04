import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPublicationAsTransporterComponent } from './modal-publication-as-transporter.component';

describe('ModalPublicationAsTransporterComponent', () => {
  let component: ModalPublicationAsTransporterComponent;
  let fixture: ComponentFixture<ModalPublicationAsTransporterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPublicationAsTransporterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPublicationAsTransporterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
