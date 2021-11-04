import { TestBed } from '@angular/core/testing';

import { YardService } from './yard.service';

describe('YardService', () => {
  let service: YardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
