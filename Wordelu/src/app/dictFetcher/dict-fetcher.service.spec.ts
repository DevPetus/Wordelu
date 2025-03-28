import { TestBed } from '@angular/core/testing';

import { DictFetcherService } from './dict-fetcher.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DictFetcherService', () => {
  let service: DictFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
