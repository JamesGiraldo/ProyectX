import { TestBed } from '@angular/core/testing';

import { YardStageService } from './yard-stage.service';

describe('YardStageService', () => {
  let service: YardStageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YardStageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
