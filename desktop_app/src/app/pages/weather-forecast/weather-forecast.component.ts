import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Weather } from 'src/app/models/weather';
import { ForecastServiceService } from 'src/app/services/forecast-service.service';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  public weatherInformation: Observable<Weather> | undefined;
  
  constructor(private readonly weatherService: ForecastServiceService) { }

  ngOnInit(): void {
    this.getLocation();
  }

  getLocation() {
    navigator.geolocation.getCurrentPosition(res => {
      this.weatherInformation = this.weatherService.getWeatherLatLng(res.coords.latitude, res.coords.longitude);
    },
      function(){
      alert('User not allowed');
    });
  }
}
