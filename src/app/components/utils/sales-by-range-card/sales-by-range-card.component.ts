import {
  Component,
  NgModule,
  Input,
  OnInit,
} from '@angular/core';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxoValueAxisModule } from 'devextreme-angular/ui/nested';
import { DataService } from 'src/app/services';
import { analyticsPanelItems } from 'src/app/types/resource';
import * as moment from 'moment';
// import { SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';

@Component({
  selector: 'sales-by-range-card',
  templateUrl: './sales-by-range-card.component.html',
  styleUrls: ['./sales-by-range-card.component.scss'],
})
export class SalesByRangeCardComponent implements OnInit {
  @Input() data: any=[];
  @Input() title: string = "";

  isPageLoading: boolean = false;
  @Input() cardID: any;

  customizeSaleText(arg: { percentText: string }) {
    return arg.percentText;
  }
  customInrFormat = {
    formatter: (value) => {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
  };


  constructor(private service:DataService) {
  }
  ngOnInit(): void {
    const [startDate, endDate] = analyticsPanelItems[0].value.split('/');
    this.loadData(startDate,endDate)
  }

  onDateRangeClick(e: any) {
    let startDate; let endDate;
    if (e[0]) { startDate = moment(e[0]).format("YYYY-MM-DD"); }
    if (e[1]) { endDate = moment(e[1]).format("YYYY-MM-DD"); }
    this.loadData(startDate, endDate)
  }
  

  loadData(startDate, endDate) {
    switch (this.cardID) {
      case 10:
        this.isPageLoading=true;
        this.service.getAllLocationSales(startDate, endDate).subscribe((result: any) => {
          let allLocationSale = JSON.parse(result.ExecuteMobiDataResult);
          allLocationSale.map((r: any) => {
            this.data.push({ name: r.LocationName, value: r.NetSales });
          });
          this.isPageLoading=false;
        },error=>{
          this.isPageLoading=false;
        });
        break;
    }
  }

}

@NgModule({
  imports: [
    CardAnalyticsModule,
    DxPieChartModule,
    DxChartModule,
    DxoValueAxisModule,
  ],
  declarations: [SalesByRangeCardComponent],
  exports: [SalesByRangeCardComponent],
})
export class SalesByRangeCardModule { }
