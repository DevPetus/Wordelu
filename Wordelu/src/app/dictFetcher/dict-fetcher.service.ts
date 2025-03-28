import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictFetcherService {
  wordList: string[] = [];
  constructor(private http: HttpClient) {
    console.log('DictFetcherService instantiated');
  }

  private async loadWordList(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get('../../assets/wordle-La.txt', { responseType: 'text' })
      );
      this.wordList = data.split('\n');
      console.log('Word list loaded!');
    } catch (error) {
      console.error('Error loading word list:', error);
    }
  }

  async getWord(seed: number): Promise<string> {
    if (this.wordList.length === 0) {
      await this.loadWordList();
    }
    seed = seed % this.wordList.length;
    return this.wordList[seed];
  }
}

