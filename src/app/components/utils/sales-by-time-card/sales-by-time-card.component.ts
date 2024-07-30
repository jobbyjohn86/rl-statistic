import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  AfterContentChecked,
  ChangeDetectorRef,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { ChartCardModule } from '../../library/chart-card/chart-card.component';
import { CommonModule } from '@angular/common';
import { DxFunnelModule, DxPieChartModule } from 'devextreme-angular';
import { DataService } from 'src/app/services';
import { ChartOptions } from 'src/app/types/resource';
import { saleByBrandOptions, saleByDepartmentOptions, saleByGroupOptions, saleBySubGroupOptions, saleByTicketOptions, saleByTimeOptions } from 'src/app/types/chartoptions';

@Component({
  selector: 'sales-by-time-card',
  templateUrl: './sales-by-time-card.component.html',
  styleUrls: ['./sales-by-time-card.component.scss'],
})
export class SaleByTimeCardComponent implements AfterViewInit, OnInit, OnChanges {

  @Input() groupByPeriods: string[];

  @Input() data: any[];

  @Input() visualRange: unknown = {};

  @Output() performancePeriodChanged = new EventEmitter();

  @Input() titleText: string = '';
  @Input() isRotated: boolean = false;
  @Input() chartType: ChartType = ChartType.bar;
  @Input() chartPalette: string = 'Violet';
  @Input() options: any;
  @Output() cardSetting = new EventEmitter();


  @Input() cardID: any;
  @Input() dates: any;

  chartOption: ChartOptions;//= saleByTimeOptions;

  cardSettingClick(e: any) {
    this.cardSetting.emit(e);
  }

  public ChartEnum = ChartType;

  constructor(private cdr: ChangeDetectorRef, private service: DataService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      let dateChanges = changes['dates'].currentValue;
      this.loadChartData(dateChanges.startDate, dateChanges.endDate, this.service.selectedLocation);
    }
  }
  ngOnInit(): void {
    console.log(this.dates);
    this.loadChartData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }


  ngAfterContentChecked(): void {
    // console.log(this.data);
  }

  customiseToolip({ seriesName }) {
    return { text: seriesName };
  }

  onDropDownSelectionChange(event) {
    this.performancePeriodChanged.emit(event);
  }

  customizeText(arg) {
    return `${arg.valueText} Hour`;
  }
  customizeDepartmentLabel(point) {
    let val = parseFloat(point.valueText).toFixed(2);
    return `${val}`; //: ${point.valueText} ${point.argumentText}  
  }

  customiseSubGrpToolip(arg) {
    return `${arg.argument} ${arg.value}`;
  }

  numberFormat = {
    type: 'fixedPoint',
    precision: 0
  };

  currencyFormat = {
    type: 'currency',
    currency: 'INR',
    precision: 0
  };

  customInrFormat = {
    formatter: (value) => {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
  };


  loadChartData(startDate, endDate, locationID) {
    this.options.isLoading = true;
    switch (this.cardID) {
      case 13: //Sale By time Graph 
        this.service.getSaleByTime(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          if (result.ExecuteMobiDataResult[0]) {
            let saleByTime = JSON.parse(result.ExecuteMobiDataResult[0]);
            this.chartOption = saleByTimeOptions;
            this.chartOption.dataSource = saleByTime;
            this.options.isLoading = false;
          }
        },error=>{
          this.options.isLoading = false;
        });
        break;
      case 14: // Sale by Ticket 
        this.service.getSaleByTicket(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          let _data = JSON.parse(result.ExecuteMobiDataResult);
          let ticketData: any = [];
          let d1 = _data.filter((r: any) => r.BillAmount <= 250 && r.BillAmount >= 1);
          ticketData.push({ name: '1 to 250', value: d1.length });
          d1 = _data.filter((r: any) => r.BillAmount <= 500 && r.BillAmount >= 251);
          ticketData.push({ name: '251 to 500', value: d1.length });
          d1 = _data.filter((r: any) => r.BillAmount <= 750 && r.BillAmount >= 501);
          ticketData.push({ name: '501 to 750', value: d1.length });
          d1 = _data.filter((r: any) => r.BillAmount <= 999 && r.BillAmount >= 751);
          ticketData.push({ name: '751 to 999', value: d1.length });
          d1 = _data.filter((r: any) => r.BillAmount >= 1000);
          ticketData.push({ name: '1000 & Above', value: d1.length });

          this.chartOption = saleByTicketOptions;
          this.chartOption.dataSource = ticketData;
          this.options.isLoading = false;
        },error=>{
          this.options.isLoading = false;
        });
        break;
      case 15: // sale by department
        this.service.getSaleByDepartment(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.chartOption = saleByDepartmentOptions;
          this.chartOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
          this.options.isLoading = false;
        },error=>{
          this.options.isLoading = false;
        });
        break;
      case 16: //sale by group
        this.service.getSaleByGroup(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.chartOption = saleByGroupOptions;
          let _saleByGroup = JSON.parse(result.ExecuteMobiDataResult);
          this.chartOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
          this.options.isLoading = false;
        },error=>{
          this.options.isLoading = false;
        });
        break;
      case 17://sale by sub group
        this.service.getSaleBySubGroup(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.chartOption = saleBySubGroupOptions;
          this.chartOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
          this.options.isLoading = false;
        },error=>{
          this.options.isLoading = false;
        });
        break;
      case 18: //sale by brand 
        this.service.getSaleByBrand(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          // this.saleByBrand = JSON.parse(result.ExecuteMobiDataResult);
          this.chartOption = saleByBrandOptions;
          this.chartOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
          this.options.isLoading = false;
        },error=>{
          this.options.isLoading = false;
        });
        break;
    }
  }

}

@NgModule({
  imports: [
    CardAnalyticsModule,
    DxChartModule,
    DxPieChartModule,
    DxDropDownButtonModule,
    ChartCardModule,
    CommonModule,
    DxFunnelModule
  ],
  declarations: [SaleByTimeCardComponent],
  exports: [SaleByTimeCardComponent],
})
export class SaleByTimeCardModule { }


export enum ChartType {
  bar,
  bullet,
  doughnut,
  financial,
  line,
  pie,
  point,
  polar,
  range,
  sparkline,
  tree,
  funnel
}