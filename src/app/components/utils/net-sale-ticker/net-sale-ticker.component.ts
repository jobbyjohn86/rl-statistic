import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';

@Component({
  selector: 'net-sale-ticker',
  templateUrl: 'net-sale-ticker.component.html',
})

export class NetSaleTickerComponent {
  @Input() data: any = null;
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardModule,
  ],
  declarations: [NetSaleTickerComponent],
  exports: [NetSaleTickerComponent],
})
export class NetSaleTickerModule { }
