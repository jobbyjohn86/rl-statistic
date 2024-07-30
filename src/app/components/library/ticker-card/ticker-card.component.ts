import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { CardAnalyticsModule } from '../card-analytics/card-analytics.component';
// import { Sales, SalesDataList, SalesOrOpportunitiesByCategory } from '../../../types/analytics';
import { ApplyPipeModule } from "src/app/pipes/apply.pipe";
import { CardMenuModule } from '../card-menu/card-menu.component';
import { CardViewModule } from '../card-view/card-view.component';

import enIN from "@angular/common/locales/en-IN";
import { DataService } from 'src/app/services';
import { DxButtonModule, DxDateRangeBoxModule, DxPopupModule } from 'devextreme-angular';
import * as moment from 'moment';

import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'ticker-card',
  templateUrl: './ticker-card.component.html',
  styleUrls: ['./ticker-card.component.scss'],
  providers: [CurrencyPipe]
})

export class TickerCardComponent implements OnInit, AfterViewInit {
  
  @Input() titleText: string;

  @Input() data: any | null = null;

  @Input() total: string | null = null;

  @Input() percentage: number;

  @Input() icon: string;

  @Input() tone?: 'warning' | 'info';

  @Input() contentClass: string | null = null;

  @Input() isMenuVisible = true;

  @Input() count: number;

  @Input() dataDetail :any;

  @Input() menuItems: Array<{ name: string,value:string }>;

  @Input() detailsItems: any=[];

  @Input() isDetailsVisible=false;

  @Input() dataSource:any=[];

  @Input() footerText:string='';
  
  @Input() columns:any=[];

  @Output() cardSettingClick = new EventEmitter();
  
  // menuItems: Array<{ text: string,value:string }> = [
  //   { text: 'My Account',value:'0' },
  //   { text: 'Discount',value:'0' },
  //   { text: 'Delivery Charges',value:'0' },
  //   { text: 'Container Charges',value:'0' },
  //   { text: 'Service Charges' ,value:'0'},
  //   { text: 'Tax',value:'0' },
  //   { text: 'Waived Off',value:'0' },
  //   { text: 'Round Off' ,value:'0'},
  //   { text: 'Total Sale',value:'0' },
  // ];

 
  blankRow:any=[];

  startDate: any;
  endDate: any;
  isDateRangeVisble: boolean = false;
  constructor(private currencyPipe: CurrencyPipe,private service: DataService) {}
  
  ngOnInit(): void {
    // if(this.dataDetail.length>0){
    //   console.log(this.dataDetail);
    //   console.log(this.dataDetail.length);

      this.blankRow = Array(4).fill(2)
    //   console.log(this.blankRow.length);
    // } 
  }
   
  ngAfterViewInit(): void {
    // console.log(this.dataDetail);
  }
  
  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };

  onDateContainerClick(event: Event, dateRangeBox: any) {
    dateRangeBox.instance.open();
  }


  getTotal(data: Array<{value?: number, total?: number}> ): number {
    return (data || []).reduce((total, item) => total + (item.value || item.total), 0);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  getIconClass = () => this.tone || (this.percentage >= 0 ? 'positive' : 'negative');


  getNumberFormat(val:any){
    return new Intl.NumberFormat("en-IN").format(val);
  }
  getCurrencyValue(price:any){
    let x = new Intl.NumberFormat("en-IN").format(price);
    // console.log(x);
    return x;
    // return this.currencyPipe.transform(
    //   x,
    //   "INR",
    //   undefined,
    //   undefined,
    //   "en-IN"
    // );
  }
  // getCount(data: Array<{count?: number, total?: number}> ): number{
  //   return (data || []).reduce((total, item) => total + (item.count || item.total), 0);
  // }

  onIconClick() {
    this.startDate = this.service.selectedDates[0];
    this.endDate = this.service.selectedDates[1];
    this.isDateRangeVisble = true;
  }


  handleValueChange(e) {
    if(e.value[0]){ this.startDate = moment(e.value[0]).format("YYYY-MM-DD"); }
    if(e.value[1]){ this.endDate = moment(e.value[1]).format("YYYY-MM-DD");  }
  }
  onSaveClick() {
    this.isDateRangeVisble = false;
    this.cardSettingClick.emit([this.startDate, this.endDate]);
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
    DxButtonModule,
    // NgxSkeletonLoaderModule.forRoot({
    //   theme: {
    //     // Enabliong theme combination
    //     extendsFromRoot: true,
    //     // ... list of CSS theme attributes
    //     height: '30px',
    //   },
    // }),
  ],
  declarations: [TickerCardComponent],
  exports: [TickerCardComponent],
})
export class TickerCardModule { }
