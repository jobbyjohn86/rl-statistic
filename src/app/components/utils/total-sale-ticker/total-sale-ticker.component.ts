import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SalesDataList, SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'total-sale-ticker',
  templateUrl: 'total-sale-ticker.component.html',
})

export class TotalSaleTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = null;
  @Input() count: number = 0;
  @Input() dataDetail: any = [];
  @Input() menuitems: any = [];
  @Input() footerText: string = '';
  @Input() cardColumns: any = [];
  @Output() cardSetting= new EventEmitter();

  cardSettingClick(e:any){
    this.cardSetting.emit(e);
  }
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardModule,
    // NgxSkeletonLoaderModule.forRoot({
    //   theme: {
    //     // Enabliong theme combination
    //     extendsFromRoot: true,
    //     // ... list of CSS theme attributes
    //     height: '30px',
    //   },
    // }),
  ],
  declarations: [TotalSaleTickerComponent],
  exports: [TotalSaleTickerComponent],
})
export class TotalSaleTickerModule { }
