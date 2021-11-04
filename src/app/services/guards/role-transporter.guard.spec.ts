import { TestBed } from '@angular/core/testing';

import { RoleTransporterGuard } from './role-transporter.guard';

describe('RoleTransporterGuard', () => {
  let guard: RoleTransporterGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleTransporterGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
