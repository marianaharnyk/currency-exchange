import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { ConvertedCurrency, Query } from '../models/currency.interface';
import { Currency } from '../models/currency.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  UsdRate: number;
  EurRate: number;
  date: Date;

  constructor( private currencyService: CurrencyService) { }

  ngOnInit(): void {
    this.date = new Date();
    this.getCurrencyRate(Currency.USD);
    this.getCurrencyRate(Currency.EUR);
  }

  getCurrencyRate(currency: string): void {
    const query: Query = {
      amount: 1,
      from: currency,
      to: Currency.UAH
    }
    this.currencyService.convert(query).subscribe((data: ConvertedCurrency) => {
      currency === Currency.USD ? this.UsdRate = data.result : this.EurRate = data.result;
    })
  }
}