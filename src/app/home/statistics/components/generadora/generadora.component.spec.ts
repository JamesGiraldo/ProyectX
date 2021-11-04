import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneradoraComponent } from './generadora.component';

describe('GeneradoraComponent', () => {
  let component: GeneradoraComponent;
  let fixture: ComponentFixture<GeneradoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneradoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneradoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
