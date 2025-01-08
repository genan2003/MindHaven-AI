import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { researcherGuard } from './researcher.guard';

describe('researcherGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => researcherGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
