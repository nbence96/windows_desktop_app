import { Injectable } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { Weather } from '../models/weather';

@Injectable({
  providedIn: 'root'
})
export class ForecastServiceService {

  constructor() {}

  getWeatherLatLng(latitude: number, longitude: number): Observable<Weather>{
    let link = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=e8596c863f81b2216c4f84cb961f86aa`
    return from(fetch(link)).pipe(switchMap((res) => res.clone().json()));
  }

  getWeatherByCity(city: string): Observable<Weather>{
    let link = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=e8596c863f81b2216c4f84cb961f86aa`
    return from(fetch(link)).pipe(switchMap((res) => res.clone().json()));
  }
}
