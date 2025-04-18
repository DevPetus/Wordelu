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
  seed = this.pseudoRandomGenerator(this.date);
  guess = "";
  guessList: Guess[] = [];
  letterMatch: number[] = [0, 0, 0, 0, 0];
  lives = 6;

  constructor(private dictFetcher: DictFetcherService) {
    this.selectWord();
  }

  async selectWord() {
    await this.dictFetcher.getWord(this.seed).then((word) => {
      this.word = word.toUpperCase();
    });
  }

  /**
   * Submits the current guess and checks for matches
   */
  submit() {
    
    this.guess = (<HTMLInputElement>document.getElementById("letter1")).value +
                 (<HTMLInputElement>document.getElementById("letter2")).value +
                 (<HTMLInputElement>document.getElementById("letter3")).value +
                 (<HTMLInputElement>document.getElementById("letter4")).value +
                 (<HTMLInputElement>document.getElementById("letter5")).value;
    this.guess = this.guess.toUpperCase();
    //Sanitize the input
    this.guess = this.guess.replace(/[^A-Z]/g, '');

    
    //If a check is failed, stop here
    if (!this.multicheck()) {return;}

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
      this.lives = -1;
    }
    else {
      this.lives--;
      if (this.lives == 0) {
        alert("You have run out of lives! The word was: " + this.word);
      }
    }
    this.partialGuess();
    this.drawGuess();
  }

  multicheck() {
    if(this.guess.length != 5) {
      alert("Please enter a 5-letter word!");
      return false;
    }
    if (this.dictFetcher.verifyWord(this.guess) == false) {
      alert("This word doesn't seem to exist, try again!");
      return false;
    }
    if (this.lives == 0) {
      alert("You have run out of lives! The word was: " + this.word);
      return false;
    }
    return true;
  }

  /**
   * Checks for partial matches in the guess
   */
  partialGuess() {
   this.letterMatch.forEach((letter, index) => {
      if (letter == 0) {
        if (this.word.includes(this.guess[index])) {
          this.letterMatch[index] = 2;
        }
      }
    });
  }

  /**
   * Adds the current guess to the guess list
   */
  drawGuess() {
    this.guessList.push({guessWord: this.guess, letterMatch: this.letterMatch});
    this.letterMatch = [0, 0, 0, 0, 0];
    this.guess = "";
  }

  /**
   * Change cell color depending on letter match 
   */
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
  
  /**
   * This function takes in a seed and generates a random value,
 * which is used to select a word from the word list.
 * The process is deterministic, thus each day the same seed will return the same value
 * @param seed seed generated with current date
 * @returns random value
 */
pseudoRandomGenerator(seed: number) {
  seed = (seed * 16807) % 2147483647;
  return seed;
}

}
