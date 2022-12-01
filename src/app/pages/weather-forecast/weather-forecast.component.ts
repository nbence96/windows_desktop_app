import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { Weather } from 'src/app/models/weather';
import { CityserviceService } from 'src/app/services/cityservice.service';
import { ForecastServiceService } from 'src/app/services/forecast-service.service';

function autocompleteObjectValidator(validOptions: Array<string>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!validOptions.includes(control.value)) {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null
  }
}

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  public weatherInformation: Observable<Weather> | undefined;
  public cityArray: string[] = [];
  form = new FormControl('',
    {
      validators: [autocompleteObjectValidator(this.cityArray), Validators.required]
  });
  filteredOptions: Observable<string[]>;
  isPlaceOfResidenceAgreed = false;

  public validation_msgs = {
    'contactAutocompleteControl': [
      { type: 'invalidAutocompleteObject', message: 'Kattints az egyik választható lehetőségre!' },
      { type: 'required', message: 'Kötelező megadni' }
    ]
  }

  constructor(private readonly weatherService: ForecastServiceService, private cityService: CityserviceService) {
    this.filteredOptions = this.form.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngOnInit(): void {
    this.csvImport();
    this.getLocation();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.cityArray.filter(option => option.toLowerCase().includes(filterValue) && option.length < 50).slice(0,100);
  }

  

  getLocation() {
    navigator.geolocation.getCurrentPosition(res => {
      this.isPlaceOfResidenceAgreed = true;
      this.weatherInformation = this.weatherService.getWeatherLatLng(res.coords.latitude, res.coords.longitude);
    },
      function(){
        alert('Időjárás jelentés helymeghatározás funkció megtagadva!');
    });
  }

  getNewWeather(city: string){
    this.weatherInformation = this.weatherService.getWeatherByCity(city);
  }

  csvImport(){
    this.cityService.getInfo().subscribe(data => {
      const list = data.split('\n');
      list.forEach( e => {
        this.cityArray.push(e);
      })
    });
  }

}
