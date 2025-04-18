import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DictFetcherService } from './dict-fetcher.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

describe('DictFetcherService', () => {
  let service: DictFetcherService;
  let http: HttpClient;
  let httpSpy: jasmine.Spy;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DictFetcherService);

    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load word list', (done) => {
    httpSpy = spyOn(http, 'get').and.returnValue(
      new Observable((observer) => {
        observer.next('word1\nword2\nword3');
        observer.complete();
      })
    );
    service.loadWordList();
    setTimeout(() => {
      expect(service.wordList[0]).toEqual("word1");
      expect(service.wordList.length).toBeGreaterThan(0);
      expect(service.exWordList[0]).toEqual("word1");
      expect(service.exWordList.length).toBeGreaterThan(0);
      done();
    }, 0); // Wait for async operations to complete
  });

  it('should catch error when retrieving word list', (done) => {
    httpSpy = spyOn(http, 'get').and.returnValue(
      new Observable((observer) => {
        observer.error('Error loading word list');
      })
    );
    service.loadWordList().then(() => {
      expect(service.wordList.length).toEqual(0);
      expect(service.exWordList.length).toEqual(0);
      done();
    });
  });
});
