import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewfactoryComponent } from './modal-newfactory.component';

describe('ModalNewfactoryComponent', () => {
  let component: ModalNewfactoryComponent;
  let fixture: ComponentFixture<ModalNewfactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewfactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewfactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
