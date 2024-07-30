import {
  Component, NgModule, Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';

@Component({
  selector: 'cash-collection-ticker',
  templateUrl: 'cash-collection-ticker.component.html',
})

export class CashCollectionTickerComponent {
  @Input() data: any = null;
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardModule,
  ],
  declarations: [CashCollectionTickerComponent],
  exports: [CashCollectionTickerComponent],
})
export class CashCollectionTickerModule { }
