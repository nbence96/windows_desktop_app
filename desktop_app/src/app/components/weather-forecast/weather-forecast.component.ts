import { Component, OnInit } from '@angular/core';
import { Observable, timeout } from 'rxjs';
import { Position, Weather } from 'src/app/models/weather';
import { ForecastServiceService } from 'src/app/services/forecast-service.service';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  public lat = 0;
  public lng = 0;
  public weatherInformations$: Observable<Weather>;

  constructor(private readonly weatherService: ForecastServiceService) {
    this.getLocation();
    this.weatherInformations$ = this.weatherService.getWeatherLatLng(this.lat, this.lng);

   }

  ngOnInit(): void {}

  getLocation() {
    return navigator.geolocation.getCurrentPosition(res => {
      this.lat = res.coords.latitude;
      this.lng = res.coords.longitude;
    },
      function(){
      alert('User not allowed')
    },{timeout:10000});
  }
}