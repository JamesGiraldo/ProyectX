import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportadoraComponent } from './transportadora.component';

describe('TransportadoraComponent', () => {
  let component: TransportadoraComponent;
  let fixture: ComponentFixture<TransportadoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransportadoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportadoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
