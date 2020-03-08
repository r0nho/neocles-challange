import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import * as randomWords from 'random-words';

Injectable({
  providedIn: 'root'
})
export class TableService {
  readonly data = this.randomWords();

  randomWords() {
    const data = [];
    const elements = 10000;

    for (let i = 0; i < elements; i++) {
      data.push({
        id: i.toString(),
        name: randomWords({exactly: 3, join: ' '}),
        description: randomWords({exactly: 100, join: ' '}),
        status: ['new', 'submitted', 'failed'][Math.floor(Math.random() * 3)],
      });
    }

    return from(data);
  }
}
