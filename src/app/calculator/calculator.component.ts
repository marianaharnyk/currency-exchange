import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service'
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ConvertedCurrency, Query } from '../models/currency.interface';
import { Currency } from '../models/currency.enum';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  leftSide: FormGroup;
  rightSide: FormGroup;
  displayedColumns: string[] = [`You give`, `You get`];
  dataSourceLeft = new MatTableDataSource<any>();
  dataSourceRight = new MatTableDataSource<any>();
  basicTableData = [1, 50, 100, 500, 1000, 5000];
  constructor(private currencyService: CurrencyService, private fb: FormBuilder) { }

  get leftSideAmount () {
    return this.leftSide.get('amount');
  }

  get leftSideCurrency () {
    return this.leftSide.get('currency');
  }

  get rightSideAmount () {
    return this.rightSide.get('amount');
  }

  get rightSideCurrency () {
    return this.rightSide.get('currency');
  }

  ngOnInit(): void {
    this.initForms();
    this.getDefaultCurrencyRate();
    this.addListeners();
    this.getTableData(true);
    this.getTableData(false);
  }

  private initForms(): void {
    this.leftSide = this.fb.group({
      amount: ['10', Validators.required],
      currency: ['UAH'],
    });

    this.rightSide = this.fb.group({
      amount: ['', Validators.required],
      currency: ['USD'],
    });
  }

  getDefaultCurrencyRate(): void {
    const query: Query = {
      amount: this.leftSideAmount.value,
      from: this.leftSideCurrency.value,
      to: Currency.USD
    }
    this.currencyService.convert(query).subscribe((data: ConvertedCurrency) => {
      this.rightSideAmount.setValue(data.result);
    })
  }

  private addListeners(): void{
    this.leftSideCurrency.valueChanges.subscribe(() => {
      if (this.leftSideAmount.value) {
        const query: Query = {
          amount: this.leftSideAmount.value,
          from: this.leftSideCurrency.value,
          to: this.rightSideCurrency.value
        }
        this.convert(query, this.rightSideAmount);
        this.getTableData(true);
        this.getTableData(false);
      }
    })

    this.rightSideCurrency.valueChanges.subscribe(() => {
      if (this.rightSideAmount.value) {
        const query: Query = {
          amount: this.rightSideAmount.value,
          from: this.rightSideCurrency.value,
          to: this.leftSideCurrency.value
        }
        this.convert(query, this.leftSideAmount);
        this.getTableData(true);
        this.getTableData(false);
      }
    })
  }

  getTableData(isLeftSide: boolean): void {
    const query: Query = {
      amount: 1,
      from: isLeftSide ? this.leftSideCurrency.value : this.rightSideCurrency.value,
      to: isLeftSide ? this.rightSideCurrency.value : this.leftSideCurrency.value 
    };

    this.currencyService.convert(query).subscribe((data: ConvertedCurrency) => {
      if (isLeftSide) {
        this.dataSourceLeft.data = this.basicTableData.map((it) => {
          return {
            from: it,
            to: it * data.info.rate
        }})
      }

      if (!isLeftSide) {
        this.dataSourceRight.data = this.basicTableData.map((it) => {
          return {
            from: it,
            to: it * data.info.rate
        }})
      }
    })    
  }

  prepareRequest(isLeftSide: boolean): void{
    if (isLeftSide && this.leftSideAmount.value) {
      const query: Query = {
        amount: this.leftSideAmount.value,
        from: this.leftSideCurrency.value,
        to: this.rightSideCurrency.value
      };
      this.convert(query, this.rightSideAmount);
    }

    if (!isLeftSide && this.rightSideAmount.value) {
      const query: Query = {
        amount: this.rightSideAmount.value,
        from: this.rightSideCurrency.value,
        to: this.leftSideCurrency.value
      };
      this.convert(query, this.leftSideAmount);
    }
  }

  convert(query: Query, abstractControl: AbstractControl): void {
    this.currencyService.convert(query).subscribe((data: ConvertedCurrency) => {
      abstractControl.setValue(data.result);
    })
  }
}