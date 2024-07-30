import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SalesDataList, SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'total-purchase-ticker',
  templateUrl: 'total-purchase-ticker.component.html',
})

export class TotalPurchaseTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = null;
  @Input() count: number = 0;
  @Input() dataDetail:any=[]
  @Input() menuitems:any=[];
  @Input() footerText:string='';
  @Input() title:string = 'Purchase';
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardModule
  ],
  declarations: [TotalPurchaseTickerComponent],
  exports: [TotalPurchaseTickerComponent],
})
export class TotalPurchaseTickerModule { }
