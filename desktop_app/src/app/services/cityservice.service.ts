import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CityserviceService {

  constructor(private http: HttpClient) { }

  getInfo(){
    return this.http.get("/assets/worldcities.csv", {responseType: 'text'});
  }
}
