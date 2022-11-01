import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Joke } from '../models/joke';

@Injectable({
  providedIn: 'root'
})
export class JokeServiceService {
  public joke$: Observable<Joke>;

  constructor() { 
    this.joke$ = from(fetch("https://api.chucknorris.io/jokes/random")).pipe(switchMap((res) => res.json()));
  }
}
