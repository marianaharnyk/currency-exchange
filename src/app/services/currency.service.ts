import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConvertedCurrency, Query } from '../models/currency.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  
  apiKey = 'lxbel7c8wtLyNn4hrT1uumbV4Efbnj7V';

  constructor(private http: HttpClient) { }

  convert (query: Query): Observable<ConvertedCurrency> {
    let headers = new HttpHeaders()
    headers = headers.set('apikey', this.apiKey)
    return this.http.get<ConvertedCurrency>(`https://api.apilayer.com/exchangerates_data/convert?to=${query.to}&from=${query.from}&amount=${query.amount}`, {headers: headers});
  }
}