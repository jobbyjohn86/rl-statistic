import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'online-sale-ticker',
  templateUrl: 'online-sale-ticker.component.html',
})

export class OnlineSaleTickerComponent {
  @Input() data: any = null;
  @Input() count: number = 0;
  @Input() dataDetail: any = [];
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardSimpleModule,
  ],
  declarations: [OnlineSaleTickerComponent],
  exports: [OnlineSaleTickerComponent],
})
export class OnlineSaleTickerModule { }
