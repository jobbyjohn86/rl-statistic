import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  AfterContentChecked,
  OnChanges,
  SimpleChanges,
  OnInit,
} from '@angular/core';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { ChartCardModule } from '../../library/chart-card/chart-card.component';
import { CommonModule } from '@angular/common';
import { DxPieChartModule } from 'devextreme-angular';
import { ChartOptions } from 'src/app/types/resource';
import { DataService } from 'src/app/services';
import { feedackGraphCardOption, saleByCustAreaOption, saleWeekDayGraphCardOption } from 'src/app/types/chartoptions';

@Component({
  selector: 'sales-graph-card',
  templateUrl: './sales-graph-card.component.html',
  styleUrls: ['./sales-graph-card.component.scss'],
})
export class SaleGraphCardComponent implements AfterContentChecked, OnChanges, OnInit {

  @Input() groupByPeriods: string[];

  @Input() data: any[];

  @Input() visualRange: unknown = {};

  @Output() performancePeriodChanged = new EventEmitter();

  @Input() titleText: string = '';
  @Input() isRotated: boolean = false;
  @Input() chartPalette: string = 'Violet';
  @Input() options: ChartOptions;
  @Output() cardSetting = new EventEmitter();

  @Input() cardID: any;
  @Input() dates: any;
  // isPageLoading: boolean = false;


  cardSettingClick(e: any) {
    this.cardSetting.emit(e);
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


  customizeTooltip = ({ valueText, seriesName }) => ({
    text: `${seriesName} years: ${valueText}`,
  });

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


  constructor(private service: DataService) {
  }
  ngOnInit(): void {
    this.loadGraphData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      let dateChanges = changes['dates'].currentValue;
      this.loadGraphData(dateChanges.startDate, dateChanges.endDate, this.service.selectedLocation);
    }
  }

  loadGraphData(startDate, endDate, locationID) {
    this.options.isLoading = true;
    switch (this.cardID) {
      case 20: // demographic
      this.options.isLoading = true;
        this.service.getSaleByDemographicArea(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.getSaleByDemographicArea(result.ExecuteMobiDataResult);
          this.options.isLoading= false;
        }, error => {
          this.options.isLoading = false;
        });
        break;
      case 21: // feedback
      this.options.isLoading = true;
        this.service.getFeedback(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.getFeedBackDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
          this.options.isLoading =false;
        },error=>{
          this.options.isLoading =false;
        })
        break;
      case 22:
        this.options.isLoading =true;
        this.service.getSaleByWeekEnd(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.options = saleWeekDayGraphCardOption;
          this.options.dataSource = JSON.parse(result.ExecuteMobiDataResult);
          this.options.isLoading=false;
        },error=>{
          this.options.isLoading=false;
        })
        break;

    }
  }


  getSaleByDemographicArea(data: any) {
    let _data = JSON.parse(data[0])
    const summary = new Map<string, number>();
    _data.forEach(transaction => {
      const { Area, Count } = transaction;
      const currentSum = summary.get(Area) || 0;
      summary.set(Area, currentSum + Count);
    });

    let _orderDetails = Array.from(summary, ([Area, Count]) => ({ Area, Count }));
    let topArea = _orderDetails.sort((a, b) => b.Count - a.Count);
    this.options = saleByCustAreaOption;

    if (topArea.length > 0) {
      this.options.footer = 'Most Customers From: ' + topArea[0].Area;
    } else {
      this.options.footer = '';
    }
    this.options.dataSource = _orderDetails;
  }

  getFeedBackDetails(data: any, startDate: any, endDate: any) {
    let feedback = [];
    let _totalOrders = JSON.parse(data);
    this.options = feedackGraphCardOption;
    this.options.footer = 'NPS Score : 0%';
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      const countMap = new Map<string, number>();
      const result: any[] = [];
      filterData.forEach((item) => {
        const key = item['Average'];
        const existingCount = countMap.get(key);
        countMap.set(key, existingCount ? existingCount + 1 : 1);
      });

      let _groupData = Array.from(countMap, ([name, value]) => ({ name, value }));
      _groupData.sort((a, b) => parseInt(b.name) - parseInt(a.name));
      _groupData.map(r => {
        if (r.value > 0) {
          result.push({ name: r.name + ' ★', value: r.value });
        }
      })

      let detractors = _groupData.filter(r => r.name == '1');
      let passives = _groupData.filter(r => (r.name == '2' || r.name == '3' || r.name == '4'));
      let promoters = _groupData.filter(r => r.name == '5');
      if (detractors.length > 0) {
        feedback.push({ name: 'Detractors', value: (detractors.length / _groupData.length) * 100, count: detractors.length, });
      }
      if (passives.length > 0) {
        feedback.push({ name: 'Passives', value: (passives.length / _groupData.length) * 100, count: passives.length, });
      }
      if (promoters.length > 0) {
        feedback.push({ name: 'Promoters', value: (promoters.length / _groupData.length) * 100, count: promoters.length, });
      }
      if (feedback.length > 0) {
        this.options.dataSource = feedback;
      }

      let npsvalue = ((promoters.length / _groupData.length) * 100) - ((detractors.length / _groupData.length) * 100)
      this.options.footer = 'NPS Score : ' + npsvalue.toFixed(2);

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
    CommonModule
  ],
  declarations: [SaleGraphCardComponent],
  exports: [SaleGraphCardComponent],
})
export class SaleGraphCardModule { }

