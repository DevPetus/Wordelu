import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictFetcherService {
  wordList: string[] = [];
  exWordList: string[] = [];
  constructor(private http: HttpClient) {
  }

  /**
   * Attempts to read the wordle word list from the assets folder
   */
   async loadWordList(): Promise<void> {
    try {
      const data = await firstValueFrom(
        this.http.get('../../assets/wordle-La.txt', { responseType: 'text' })
      );
      const data2 = await firstValueFrom(
        this.http.get('../../assets/wordle-Ta.txt', { responseType: 'text' })
      );
      this.wordList = data.split('\n');
      this.exWordList = data2.split('\n');
    } catch (error) {
      console.error('Error loading word list:', error);
    }
  }

  /**
   * Returns a word from the word list based on the seed
   */
  async getWord(seed: number): Promise<string> {
    if (this.wordList.length === 0) {
      await this.loadWordList();
    }
    seed = seed % this.wordList.length;
    return this.wordList[seed];
  }

  /**
   * Checks if the submitted word is present in either of the dictionnaries
   * @param word to verify
   * @returns result of check (true if word is in one of the two dictionnaries)
   */
  verifyWord(word: string): boolean {
    return this.wordList.includes(word.toLowerCase()) || this.exWordList.includes(word.toLowerCase());
  }
}

