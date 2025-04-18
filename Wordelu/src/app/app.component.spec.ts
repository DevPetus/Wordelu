import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DictFetcherService } from './dictFetcher/dict-fetcher.service';
import { DebugElement } from '@angular/core';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let debugElement: DebugElement;
  let dictFetcherService: DictFetcherService;
  let dictFetcherSpy : any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [DictFetcherService]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    debugElement = fixture.debugElement;

    dictFetcherService = debugElement.injector.get(DictFetcherService);
    
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'Wordelu' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Wordelu');
  });

  it('should upper chosen word', (done) => {
    dictFetcherSpy = spyOn(dictFetcherService, 'getWord').and.resolveTo("tests");
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.word = "";
    app.selectWord().then(() => {
      expect(dictFetcherSpy).toHaveBeenCalledWith(app.seed);
      expect(app.word).toEqual("TESTS");
      done();
    });
  });

  it('should get the submitted word', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.guess = "test";
    (<HTMLInputElement>document.getElementById("letter1")).value = "t";
    (<HTMLInputElement>document.getElementById("letter2")).value = "e";
    (<HTMLInputElement>document.getElementById("letter3")).value = "s";
    (<HTMLInputElement>document.getElementById("letter4")).value = "t";
    (<HTMLInputElement>document.getElementById("letter5")).value = "s";
    app.submit();
    expect(app.guess).toEqual("TESTS");
  });

  it('should check if the word is in the dictionary', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    app.guess = "tests";

    expect(app.multicheck()).toBeTrue();
    expect(dictFetcherSpy).toHaveBeenCalledWith(app.guess);
  });

  it('should check if the word is not in the dictionary', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const fixtureService = TestBed.inject(DictFetcherService);
    const dictFetcherFixture = fixtureService as DictFetcherService;
    app.guess = "tests";
    //Set wordList from dictFetcherService
    dictFetcherFixture.wordList = ["sauce", "words", "lists"];
    expect(app.multicheck()).toBeFalse();
  });

  it('should check if the word is not 5 letters long', () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.guess = "test";
    expect(app.multicheck()).toBeFalse();
  });

  it('should check if the player has lost', () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.lives = 0;
    app.multicheck();
    expect(app.multicheck()).toBeFalse();
  });

  it('should check if the player has won', () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.word = "TESTS";
    (<HTMLInputElement>document.getElementById("letter1")).value = "t";
    (<HTMLInputElement>document.getElementById("letter2")).value = "e";
    (<HTMLInputElement>document.getElementById("letter3")).value = "s";
    (<HTMLInputElement>document.getElementById("letter4")).value = "t";
    (<HTMLInputElement>document.getElementById("letter5")).value = "s";
    
    app.submit();
    expect(app.lives).toEqual(-1);
  });

  it('should detect an incorrect guess', () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.word = "SAUCE";
    (<HTMLInputElement>document.getElementById("letter1")).value = "t";
    (<HTMLInputElement>document.getElementById("letter2")).value = "e";
    (<HTMLInputElement>document.getElementById("letter3")).value = "s";
    (<HTMLInputElement>document.getElementById("letter4")).value = "t";
    (<HTMLInputElement>document.getElementById("letter5")).value = "s";
    
    app.submit();
    expect(app.lives).toEqual(5);
  });

  it('should detect a loss', () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.word = "SAUCE";
    app.lives = 1;
    (<HTMLInputElement>document.getElementById("letter1")).value = "t";
    (<HTMLInputElement>document.getElementById("letter2")).value = "e";
    (<HTMLInputElement>document.getElementById("letter3")).value = "s";
    (<HTMLInputElement>document.getElementById("letter4")).value = "t";
    (<HTMLInputElement>document.getElementById("letter5")).value = "s";
    
    app.submit();
    expect(app.lives).toEqual(0);
  });

  it('should detect that the player ran out of lives' , () => {
    dictFetcherSpy = spyOn(dictFetcherService, 'verifyWord').and.returnValue(true);
    
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.guess = "SAUCE";
    app.lives = 0;
    expect(app.multicheck()).toBeFalse();
  });

  it('should guess the right color (green)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let returnValue = app.guessColor(1);
    expect(returnValue).toEqual("green");
  });

  it('should guess the right color (grey)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let returnValue = app.guessColor(0);
    expect(returnValue).toEqual("grey");
  });

  it('should guess the right color (yellow)', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let returnValue = app.guessColor(2);
    expect(returnValue).toEqual("yellow");
  });

  it('should detect a partial match', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.word = "SAUCE";
    app.guess = "SZZZZ";
    app.partialGuess();

    expect(app.letterMatch[0]).toEqual(2);
    expect(app.letterMatch[1]).toEqual(0); 
  });

  it('should always get the same seed for the same day', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    let date = 1000;
    let seed = app.pseudoRandomGenerator(date);
    let newSeed = app.pseudoRandomGenerator(date);
    expect(seed).toEqual(newSeed);
    newSeed = app.pseudoRandomGenerator(date);
    expect(seed).toEqual(newSeed);
    newSeed = app.pseudoRandomGenerator(date);
    expect(seed).toEqual(newSeed);
    date = 2000;
    newSeed = app.pseudoRandomGenerator(date);
    expect(seed).not.toEqual(newSeed);
    seed = newSeed;
    newSeed = app.pseudoRandomGenerator(date);
    expect(seed).toEqual(newSeed);
  });
});