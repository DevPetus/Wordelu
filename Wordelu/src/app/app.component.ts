import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DictFetcherService } from './dictFetcher/dict-fetcher.service';
import { NgFor, CommonModule } from '@angular/common';

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
  guessList: string[] = [];
  letterMatch: boolean[] = [false, false, false, false, false];
  constructor(private dictFetcher: DictFetcherService) {
    this.selectWord();
  }

  async selectWord() {
    await this.dictFetcher.getWord(this.seed).then((word) => {
      this.word = word;
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
    console.log("Submitted word: " + this.guess);

    this.guess[0] === this.word[0] ? this.letterMatch[0] = true : this.letterMatch[0] = false;
    this.guess[1] === this.word[1] ? this.letterMatch[1] = true : this.letterMatch[1] = false;
    this.guess[2] === this.word[2] ? this.letterMatch[2] = true : this.letterMatch[2] = false;
    this.guess[3] === this.word[3] ? this.letterMatch[3] = true : this.letterMatch[3] = false;
    this.guess[4] === this.word[4] ? this.letterMatch[4] = true : this.letterMatch[4] = false;
    console.log("Letter match: " + this.letterMatch);
    if (this.letterMatch[0] && this.letterMatch[1] && this.letterMatch[2] && this.letterMatch[3] && this.letterMatch[4]) {
      alert("Congratulations! You have guessed the word!");
    }
    else {
      this.drawGuess(this.guess, this.letterMatch);
    }
  }

  drawGuess(guess: string, letterMatch: boolean[]) {
    this.guessList.push(guess + " " + letterMatch);
  }
}


function pseudoRandomGenerator(value: number) {
  console.log("DateSeed: " + value);
  value = (value * 16807) % 2147483647;
  return value;
}

