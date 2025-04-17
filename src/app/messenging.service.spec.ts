import { TestBed } from '@angular/core/testing';

import { MessengingService } from './messenging.service';

describe('MessengingService', () => {
  let service: MessengingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessengingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
