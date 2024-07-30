import {
  Component,
  NgModule,
  Input,
} from '@angular/core';
import { CardAnalyticsModule } from '../../library/card-analytics/card-analytics.component';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxBulletModule } from 'devextreme-angular/ui/bullet';

@Component({
  selector: 'sale-type-analysis-card',
  templateUrl: './sale-type-analysis-card.component.html',
  styleUrls: ['./sale-type-analysis-card.component.scss'],
})
export class SaleTypeAnalysisCardComponent {
  @Input() data: any;
  @Input() titleText: string = 'Location Insight';
  @Input() totalSale: number = 0;
  @Input() columns: any = [];

  currencyFormat: any = { style: 'currency', currency: 'INR' };

  constructor() {
    this.contribution = this.contribution.bind(this);
  }

  contribution(rowData: any) {
    // console.log(rowData);
    let contri = (rowData.value / this.totalSale) * 100;
    return contri.toFixed(2);
  }
}

@NgModule({
  imports: [
    CardAnalyticsModule,
    DxDataGridModule,
    DxBulletModule,
  ],
  declarations: [SaleTypeAnalysisCardComponent],
  exports: [SaleTypeAnalysisCardComponent],
})
export class SaleTypeAnalysisCardModule { }