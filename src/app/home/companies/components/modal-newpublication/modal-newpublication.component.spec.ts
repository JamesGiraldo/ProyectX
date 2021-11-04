import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewPublicationComponent } from './modal-newpublication.component';

describe('ModalNewPublicationComponent', () => {
  let component: ModalNewPublicationComponent;
  let fixture: ComponentFixture<ModalNewPublicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewPublicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewPublicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
