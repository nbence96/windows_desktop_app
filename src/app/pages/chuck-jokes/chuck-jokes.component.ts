import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Joke } from 'src/app/models/joke';
import { JokeServiceService } from 'src/app/services/joke-service.service';

@Component({
  selector: 'app-chuck-jokes',
  templateUrl: './chuck-jokes.component.html',
  styleUrls: ['./chuck-jokes.component.scss']
})
export class ChuckJokesComponent implements OnInit {
  public readonly dailyJoke$: Observable<Joke>;
  
  constructor(private readonly jokeService: JokeServiceService) {
    this.dailyJoke$ = this.jokeService.joke$;
  }

  ngOnInit(): void {
  }

}
