import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
  AfterContentChecked,
  AfterContentInit,
  DoCheck,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CardAnalyticsModule } from '../card-analytics/card-analytics.component';
import { ApplyPipeModule } from "src/app/pipes/apply.pipe";
import { CardMenuModule } from '../card-menu/card-menu.component';
import { CardViewModule } from '../card-view/card-view.component';

import enIN from "@angular/common/locales/en-IN";
import { DataService } from 'src/app/services';
import { DxButtonModule, DxDateRangeBoxModule, DxPopupModule } from 'devextreme-angular';
import * as moment from 'moment';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DynamicCardOptions } from 'src/app/types/resource';
import { UnsortedKeyvaluePipe } from 'src/app/pipes/unsortedKeyvaluePipe';
import { ColumnMapperService } from 'src/app/services/column-mapper.service';

@Component({
  selector: 'card-dynamic',
  templateUrl: './card-dynamic.component.html',
  styleUrls: ['./card-dynamic.component.scss'],
  providers: [CurrencyPipe]
})

export class CardDynamicComponent implements OnInit {

  @Input() cardOptions: DynamicCardOptions = {
    cardTitle: '',
    showDateRamge: false,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: false,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: undefined,
    addTopBlankRowOnCard: false,
    columnMap: [],
    gridColumn: [],
    isLoading:true
  }

  JSON: JSON;

  @Input() tone?: 'warning' | 'info';

  @Output() cardDateRangeClick = new EventEmitter();


  blankRow: any = [];
  startDate: any;
  endDate: any;
  isDateRangeVisble: boolean = false;
  isDateModified: boolean = false;


  mappedColumns: string[];
  mappedData: any[];




  constructor(private currencyPipe: CurrencyPipe, private service: DataService, private columnMapperService: ColumnMapperService) { }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.cardOptions.columnMap.length > 0) {
  //     console.log(this.cardOptions.dataTable);
  //   }
  // }
  // ngDoCheck(): void {
  //   if (this.cardOptions.columnMap.length > 0) {
  //     console.log(this.cardOptions.dataTable);
  //   }
  // }

  // ngAfterContentInit(): void {
  //   if (this.cardOptions.columnMap.length > 0) {
  //     console.log(this.cardOptions.dataTable);
  //   }
  // }
  // ngAfterContentChecked(): void {
  //   if(this.cardOptions.columnMap.length>0){
  //   console.log(this.cardOptions.dataTable);
  //   }
  // }

  // ngAfterViewInit(): void {
  //   if(this.cardOptions.columnMap.length>0){
  //     // console.log(this.cardOptions);
  //     let cloned = this.cardOptions.dataTable.map(x => Object.assign({}, x));
  //     // const _data = JSON.parse(JSON.stringify(this.cardOptions.dataTable)) ;
  //     const objArray = [...cloned];
  //     console.log(objArray);
  //   }
  // }

  ngOnInit(): void {
    this.blankRow = Array(4).fill(2);
    // console.log(this.cardOptions);

    // console.log(this.cardOptions);

    // console.log(this.cardOptions.dataTable);
    // if(this.cardOptions.columnMap.length>0){
    //   // console.log(this.cardOptions);
    //   let cloned = this.cardOptions.dataTable.map(x => Object.assign({}, x));
    //   // const _data = JSON.parse(JSON.stringify(this.cardOptions.dataTable)) ;
    //   const objArray = [...cloned];
    //   console.log(objArray);
    // }


    // if (this.cardOptions.columnMap.length > 0) {
    //   console.log(this.cardOptions.dataTable);

    //   const objArray = [...this.cardOptions.dataTable];
    //   // [
    //   //   { name: 'John', age: 30, country: 'USA' },
    //   //   { name: 'Alice', age: 25, country: 'Canada' },
    //   //   { name: 'Bob', age: 35, country: 'UK' },
    //   //   { name: 'Eve', age: 28, country: 'Australia' }
    //   // ];

    //   const renameArray = [
    //     { caption: 'firstName', dataField: 'name' },
    //     // Add more objects in renameArray if needed
    //   ];

    //   const updatedObjArray = this.renamePropertiesInArray(objArray, renameArray);
    //   console.log(updatedObjArray);

    //   // console.log(this.cardOptions.dataTable);
    //   // const updatedObjArray = this.renamePropertiesInArray(this.cardOptions.dataTable, this.cardOptions.columnMap);
    //   // console.log(updatedObjArray);
    // }



  }

  renamePropertiesInArray(objArray: any[], renameArray: any[]): any[] {
    return objArray.map(obj => {
      const updatedObj = { ...obj }; // Make a shallow copy of the original object
      for (const renameInfo of renameArray) {
        const { caption, dataField } = renameInfo;
        if (updatedObj.hasOwnProperty(dataField)) {
          updatedObj[caption] = updatedObj[dataField];
          delete updatedObj[dataField];
        }
      }
      return updatedObj;
    });
  }


  getClass(value: any): string {
    if (this.cardOptions.columnLimit) {
      return 'column-' + this.cardOptions.columnLimit;
    } else {
      if (Object.keys(value).length == 0) {
        return 'column';
      } else if (Object.keys(value).length > 4) {
        return 'column-4'
      }
      else {
        return 'column-' + Object.keys(value).length;
      }
    }
  }

  getMapClass(value: any): string {
    // return 'column-' + value.length;
    if (this.cardOptions.columnLimit) {
      return 'column-' + this.cardOptions.columnLimit;
    } else {
      if (value.length == 0) {
        return 'column';
      } else if (value.length > 4) {
        return 'column-4'
      }
      else {
        return 'column-' + value.length;
      }
    }
  }

  get propertyNames(): string[] {
    if (this.cardOptions.dataTable.length === 0) {
      return [];
    }
    return Object.keys(this.cardOptions.dataTable[0]);
  }

  isNumber(value: any): boolean {
    return this.service.isNumber(value);
    // return typeof value === 'number';
  }

  isCurrency(value: any, key: string): boolean {
    // const currencyFields = ['price', 'cost', 'amount', 'value']; // Example field names that are likely to be currency
    // const isLikelyCurrencyField = currencyFields.includes(key.toLowerCase());
    // return this.isNumber(value) && (isLikelyCurrencyField);
    return this.service.isCurrency(value,key);
  }


  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };

  onDateContainerClick(event: Event, dateRangeBox: any) {
    dateRangeBox.instance.open();
  }


  getTotal(data: Array<{ value?: number, total?: number }>): number {
    // let xx =(data || []).reduce((total, item) => total + (item.value? item.value:0 || item.total? item.total:0), 0);
    // console.log(xx);
    return(data || []).reduce((total, item) => total + (item.value? item.value:0 || item.total? item.total:0), 0); //(data || []).reduce((total, item) => total + (item.value || item.total), 0);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  getIconClass = () => this.tone || (this.cardOptions.percentageVal >= 0 ? 'positive' : 'negative');


  getNumberFormat(val: any) {
    return new Intl.NumberFormat("en-IN").format(val);
  }
  getCurrencyValue(price: any) {
    let x = new Intl.NumberFormat("en-IN").format(price);
    return x;
  }

  onIconClick() {
    this.startDate = this.service.selectedDates[0];
    this.endDate = this.service.selectedDates[1];
    this.isDateRangeVisble = true;
  }


  handleValueChange(e) {
    if (e.value[0]) { this.startDate = moment(e.value[0]).format("YYYY-MM-DD"); }
    if (e.value[1]) { this.endDate = moment(e.value[1]).format("YYYY-MM-DD"); }
  }
  onSaveClick() {
    this.isDateRangeVisble = false;
    this.cardDateRangeClick.emit([this.startDate, this.endDate]);
    this.isDateModified = true;
  }

  onPopupHiding(e: any) {
    this.isDateRangeVisble = false;
  }



}

@NgModule({
  imports: [
    CardAnalyticsModule,
    ApplyPipeModule,
    CardMenuModule,
    CardViewModule,

    CommonModule,
    DxPopupModule,
    DxDateRangeBoxModule,
    DxButtonModule
  ],
  declarations: [CardDynamicComponent, UnsortedKeyvaluePipe],
  exports: [CardDynamicComponent],
})
export class CardDynamicModule { }
