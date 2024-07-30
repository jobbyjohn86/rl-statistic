import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DynamicCardOptions } from 'src/app/types/resource';
import { CardDynamicModule } from '../../library/card-dynamic/card-dynamic.component';
import { CardAnalyticsModule } from "../../library/card-analytics/card-analytics.component";
import { DataService } from 'src/app/services';

@Component({
  selector: 'fraud-cotrol-cardlist',
  templateUrl: './fraud-cotrol-cardlist.component.html',
  styleUrls: ['./fraud-cotrol-cardlist.component.scss'],
})


export class FraudCotrolCardlistComponent implements OnInit, OnChanges{

  @Input() cardOptions :DynamicCardOptions;
  @Output() cardDateRange= new EventEmitter();
  @Output() menuClick= new EventEmitter();
  // @Input() fraudControlData:any;
  @Input() showDateRange:boolean;

  
  @Input() cardID: any;
  @Input() dates: any;

  isPageLoading: boolean = false;


  fraudControlData: any = [
    { name: 'Modified Invoices', value: 0, count: 0 },
    { name: 'Void Invoices', value: 0, count: 0 },
    { name: 'Discounted Invoices', value: 0, count: 0 },
    { name: 'Reprinted Invoices', value: 0, count: 0 },
    { name: 'Open KOT', value: 0, count: 0 },
    { name: 'Void KOT', value: 0, count: 0 },
    { name: 'Re-Printed KOT', value: 0, count: 0 },
    { name: 'NC KOT', value: 0, count: 0 }
  ];

  constructor(private service:DataService) {
   
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      let dateChanges = changes['dates'].currentValue;
      this.loadData(dateChanges.startDate, dateChanges.endDate, this.service.selectedLocation);
    }
  }
  ngOnInit(): void {
    this.loadData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
  }

  cardDateRangeClick(e:any){
    // this.cardDateRange.emit(e);
    // console.log(e);
    this.dates.startDate = e[0];
    this.dates.endDate= e[1];
    this.loadData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
  }

  onMenuClick(e: any) {
    console.log(e);
    if(e.itemData.id==1){
      this.loadData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
    }
    // this.menuClick.emit(e);
  }

  loadData(startDate, endDate, locationID){
    this.isPageLoading = true;
    this.service.getFraudControl(startDate, endDate, this.service.selectedLocation).subscribe((result:any)=>{
      this.getFraudControl(result.ExecuteMobiDataResult);
    },error=>{
      this.isPageLoading=false;
    });
  }

  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };
  
  getFraudControl(data: any) {
    this.fraudControlData = [];

    // Unsettled Invoice
    let _unsettled = JSON.parse(data[5]);
    if (_unsettled.length > 0) {
      this.fraudControlData.push({ name: 'Unsettled Invoices', value: _unsettled.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _unsettled.length });
    } else {
      this.fraudControlData.push({ name: 'Unsettled Invoices', value: 0, count: 0 });
    }

    //Discount
    let _discount = JSON.parse(data[1]);
    if (_discount.length > 0) {
      this.fraudControlData.push({ name: 'Discounted Invoice', value: _discount.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _discount.length });
    } else {
      this.fraudControlData.push({ name: 'Discounted Invoices', value: 0, count: 0 });
    }

     //Reprint
     let _reprint = JSON.parse(data[2]);
     if (_reprint.length > 0) {
       this.fraudControlData.push({ name: 'Reprinted Invoices', value: _reprint.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _reprint.length });
     } else {
       this.fraudControlData.push({ name: 'Reprinted Invoices', value: 0, count: 0 });
     }
 
      //Cancelled
      let _cancelled = JSON.parse(data[6]);
      if (_cancelled.length > 0) {
        this.fraudControlData.push({ name: 'Cancelled Invoices', value: _cancelled.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _cancelled.length });
      } else {
        this.fraudControlData.push({ name: 'Cancelled Invoices', value: 0, count: 0 });
      }


    // -------------------- KOT -------------------//

    // void KOT
    let _voids = JSON.parse(data[0]);
    if (_voids.length > 0) {
      this.fraudControlData.push({ name: 'Void KOT', value: _voids.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _voids.length });
    } else {
      this.fraudControlData.push({ name: 'Void KOT', value: 0, count: 0 });
    }

    //Open KOT
    let _kot = JSON.parse(data[3]);
    if (_kot.length > 0) {
      this.fraudControlData.push({ name: 'Open KOT', value: _kot.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _kot.length });
    } else {
      this.fraudControlData.push({ name: 'Open KOT', value: 0, count: 0 });
    }

    //Reprinted KOT
    let _reprinted = JSON.parse(data[4]);
    if (_reprinted.length > 0) {
      this.fraudControlData.push({ name: 'Re-Printed KOT', value: _reprinted.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _reprinted.length });
    } else {
      this.fraudControlData.push({ name: 'Re-Printed KOT', value: 0, count: 0 });
    }

    //NC KOT
    let _NCKot = JSON.parse(data[8]);
    if (_NCKot.length > 0) {
      this.fraudControlData.push({ name: 'NC KOT', value: _NCKot.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _NCKot.length });
    } else {
      this.fraudControlData.push({ name: 'NC KOT', value: 0, count: 0 });
    }

    this.isPageLoading=false;
  }



}

@NgModule({
    declarations: [FraudCotrolCardlistComponent],
    exports: [FraudCotrolCardlistComponent],
    imports: [
        CardDynamicModule,
        CardAnalyticsModule
    ]
})
export class FraudCotrolCardlistModule { }