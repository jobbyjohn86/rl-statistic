import {
  Component,
  NgModule,
  Input,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxBulletModule } from 'devextreme-angular/ui/bullet';
import { RankPipe, RankPipeModule } from 'src/app/pipes/rank.pipe';
import { DatePipe } from '@angular/common';
import { DataService, ThemeService } from 'src/app/services';
import { analyticsPanelItems } from 'src/app/types/resource';
import { Observable, forkJoin } from 'rxjs';
import { map, share } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';
import * as moment from 'moment';

type DataLoader = (startDate: string, endDate: string, location: number) => Observable<any>;

@Component({
  selector: 'revenue-analysis-card',
  templateUrl: './revenue-analysis-card.component.html',
  styleUrls: ['./revenue-analysis-card.component.scss'],
  providers: [RankPipe]
})
export class RevenueAnalysisCardComponent implements OnInit {
  @Input() data: any;
  @Input() supportData: any;

  currencyFormat: any = { style: 'currency', currency: 'INR' };

  @Input() totalSale: number = 0;
  @Output() menuClick = new EventEmitter();
  @Input() cardID: any;

  isPageLoading: boolean = false;

  constructor(private rankPipe: RankPipe, private service: DataService, private cdr:ChangeDetectorRef) {
    this.calcualateContr = this.calcualateContr.bind(this);
    this.calcualateRank = this.calcualateRank.bind(this);
    this.lastSync = this.lastSync.bind(this);
    this.lastClosedOn = this.lastClosedOn.bind(this);
    // this.loadCardData = this.loadCardData.bind(this);
    // this.getSupportData = this.getSupportData.bind(this);
    // this.getTotalSale = this.getTotalSale.bind(this);
    this.loadData = this.loadData.bind(this);
    // this.cdr.detectChanges();
  }

  calcualateContr(rowData: any) {
    let contr = (rowData.NetSales / this.totalSale) * 100;
    return isNaN(contr)?0:contr.toFixed(2);
  }

  calcualateRank(rowData: any) {
    return this.rankPipe.transform(
      this.data.map(item => item.NetSales),
      rowData.NetSales
    );
  }

  lastSync(rowData: any) {
    let filterdata = this.supportData.filter(r => r.LocationID == rowData.LocationID);
    var datePipe = new DatePipe('en-IN');
    if (filterdata.length > 0) {
      let syncTime = datePipe.transform(filterdata[0]?.IPLastSend.replace('/Date(', '').replace(')/', ''), 'dd/MM/yyyy HH:mm');
      return syncTime;
    } else { return '' }
  }

  lastClosedOn(rowData: any){
    let filterdata = this.supportData.filter(r => r.LocationID == rowData.LocationID);
    var datePipe = new DatePipe('en-IN');
    if (filterdata.length > 0) {
      let syncTime = datePipe.transform(filterdata[0]?.LastClosedDay?.replace('/Date(', '').replace(')/', ''), 'dd/MM/yyyy HH:mm');
      return syncTime;
    } else { return '' }
  }


  onMenuClick(e: any) {
    console.log(e);
    // this.menuClick.emit(e);
    // this.service.getAllLocationSales(this.service.selectedDates[0], this.service.selectedDates[1]).subscribe((result: any) => {
    //   this.data = JSON.parse(result.ExecuteMobiDataResult);
    //   // this.allLocationSale.map((r: any) => {
    //   //   this.saleChart.push({ name: r.LocationName, value: r.NetSales });
    //   // });
    // });

    // this.getSupportData(this.service.selectedLocation);
    // this.getTotalSale();
  }

  onDateRangeClick(e: any) {
    console.log(e);
    let startDate; let endDate;
    if (e[0]) { startDate = moment(e[0]).format("YYYY-MM-DD"); }
    if (e[1]) { endDate = moment(e[1]).format("YYYY-MM-DD"); }
    this.loadData(startDate, endDate)
  }

  ngOnInit(): void {
    const [startDate, endDate] = analyticsPanelItems[0].value.split('/');
    // this.loadCardData(startDate, endDate, this.service.selectedLocation);
    // this.getSupportData(startDate, endDate, this.service.selectedLocation);
    // this.getTotalSale(startDate, endDate, this.service.selectedLocation);
    this.loadData(startDate, endDate);

  }

  loadData(startDate: string, endDate: string) {
    this.isPageLoading = true;
    const tasks: Observable<any>[] = [
      ['allLocationSale', (s: string, e: string, num: number) => this.service.getAllLocationSales(s, e)],
      ['supportData', (s: string, e: string, num: number) => this.service.getmultiLocationData(s, e, this.service.selectedLocation)],
      ['getTotalSale', (s: string, e: string, num: number) => this.service.getTotalSales(s, e, this.service.selectedLocation)],
    ].map(([dataName, loader]: [string, DataLoader]) => {
      const loaderObservable = loader(startDate, endDate, 0).pipe(share());
      loaderObservable.subscribe((result: any) => {
        switch (dataName) {
          case 'allLocationSale':
            this.data = JSON.parse(result.ExecuteMobiDataResult);
            // console.log(this.data);
            this.cdr.detectChanges();
            break;
          case 'supportData':
            this.supportData = JSON.parse(result.ExecuteMobiDataResult[0]);
            break;
          case 'getTotalSale':
            let _totalSales = JSON.parse(result.ExecuteMobiDataResult);
            let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
            if (filterData.length > 0) {
              let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
                return a + b;
              });
              this.totalSale = sum; //[{ name: 'Total Sales', value: sum }];
            }
            break;
        }

      }, error => {
        // console.log(error);
        notify(error.error + ', Please Try Again', 'error', 2000);
      });
      return loaderObservable;
    });

    forkJoin(tasks).subscribe(() => {
      this.isPageLoading = false;
    }, error =>
      this.isPageLoading = false
    );

  }


}

@NgModule({
  imports: [
    CardAnalyticsModule,
    DxDataGridModule,
    DxBulletModule,
    RankPipeModule
  ],
  declarations: [RevenueAnalysisCardComponent],
  exports: [RevenueAnalysisCardComponent],
})
export class RevenueAnalysisCardModule { }


  // loadCardData(startDate, endDate, locationID) {
  //   switch (this.cardID) {
  //     case 9:
  //       this.service.getAllLocationSales(startDate, endDate).subscribe((result: any) => {
  //         this.data = JSON.parse(result.ExecuteMobiDataResult);
  //         // this.allLocationSale.map((r: any) => {
  //         //   this.saleChart.push({ name: r.LocationName, value: r.NetSales });
  //         // });
  //       });
  //       break;
  //   }
  // }

  // getSupportData(startDate, endDate, locationID) {
  //   this.service.getmultiLocationData(startDate, endDate, locationID).subscribe((result: any) => {
  //     this.supportData = JSON.parse(result.ExecuteMobiDataResult[0]);
  //   });
  // }

  // getTotalSale(startDate, endDate, locationID) {
  //   this.service.getTotalSales(startDate, endDate, locationID).subscribe((result: any) => {
  //     let _totalSales = JSON.parse(result.ExecuteMobiDataResult);
  //     let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       this.totalSale = sum; //[{ name: 'Total Sales', value: sum }];
  //     }
  //   });
  // }

