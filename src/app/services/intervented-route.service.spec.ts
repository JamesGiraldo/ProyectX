import { TestBed } from '@angular/core/testing';

import { InterventedRouteService } from './intervented-route.service';

describe('InterventedRouteService', () => {
  let service: InterventedRouteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterventedRouteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
