import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNewstageComponent } from './modal-newstage.component';

describe('ModalNewstageComponent', () => {
  let component: ModalNewstageComponent;
  let fixture: ComponentFixture<ModalNewstageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNewstageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNewstageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
