import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DictFetcherService } from './dictFetcher/dict-fetcher.service';
import { NgFor, CommonModule } from '@angular/common';
import { Guess } from './interface/guess';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Wordelu';
  date = new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
  word = "???";
  seed = pseudoRandomGenerator(this.date);
  guess = "";
  guessList: Guess[] = [];
  letterMatch: number[] = [0, 0, 0, 0, 0];
  constructor(private dictFetcher: DictFetcherService) {
    this.selectWord();
  }

  async selectWord() {
    await this.dictFetcher.getWord(this.seed).then((word) => {
      this.word = word.toUpperCase();
    console.log("Seed: " + this.seed);
    console.log("Word: " + this.word);
    });
  }

  submit() {
    this.guess = (<HTMLInputElement>document.getElementById("letter1")).value +
                 (<HTMLInputElement>document.getElementById("letter2")).value +
                 (<HTMLInputElement>document.getElementById("letter3")).value +
                 (<HTMLInputElement>document.getElementById("letter4")).value +
                 (<HTMLInputElement>document.getElementById("letter5")).value;
    this.guess = this.guess.toUpperCase();
    console.log("Submitted word: " + this.guess);

    this.letterMatch[0] = this.guess[0] == this.word[0] ? 1 : 0;
    this.letterMatch[1] = this.guess[1] == this.word[1] ? 1 : 0;
    this.letterMatch[2] = this.guess[2] == this.word[2] ? 1 : 0;
    this.letterMatch[3] = this.guess[3] == this.word[3] ? 1 : 0;
    this.letterMatch[4] = this.guess[4] == this.word[4] ? 1 : 0;
    if (this.letterMatch[0] == 1 && 
        this.letterMatch[1] == 1 && 
        this.letterMatch[2] == 1 && 
        this.letterMatch[3] == 1 && 
        this.letterMatch[4] == 1) {
      alert("Congratulations! You have guessed the word!");
    }
    else {
    }
    console.log("Letter match: " + this.letterMatch);
    this.partialGuess();
    this.drawGuess();
  }

  partialGuess() {
   this.letterMatch.forEach((letter, index) => {
      if (letter == 0) {
        if (this.word.includes(this.guess[index])) {
          this.letterMatch[index] = 2;
          console.log("partial match :", this.guess[index])
        }
      }
    });
  }

  drawGuess() {
    this.guessList.push({guessWord: this.guess, letterMatch: this.letterMatch});
    this.letterMatch = [0, 0, 0, 0, 0];
    console.log("Guess list: ");
    this.guessList.forEach((guess) => {
      console.log("Guess: " + guess.guessWord + " Letter match: " + guess.letterMatch);
    });
  }

  guessColor(letterMatch: number) {
    if (letterMatch == 0) {
      return "grey";
    }
    else if (letterMatch == 1) {
      return "green";
    }
    else {
      return "yellow";
    }
  }
}


function pseudoRandomGenerator(value: number) {
  console.log("DateSeed: " + value);
  value = (value * 16807) % 2147483647;
  return value;
}

