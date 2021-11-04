import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockagesComponent } from './blockages.component';

describe('BlockagesComponent', () => {
  let component: BlockagesComponent;
  let fixture: ComponentFixture<BlockagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
