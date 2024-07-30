import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'number-of-orders-ticker',
  templateUrl: 'number-of-orders-ticker.component.html',
})

export class NumberOfOrdersTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = 0;
  @Input() count: number = 0;
  @Input() details: any = [];
  @Input() titleText: string = 'Orders';
  @Input() footerText: string = '';
  @Input() columns:any=[];
  @Input() IsCount:boolean=false
  @Input() isGrouped:boolean=false;
  @Input() cardColumns:any=[];
  @Input() isContent:boolean=false;
  @Output() cardSetting= new EventEmitter();


  cardSettingClick(e:any){
    this.cardSetting.emit(e);
  }
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardSimpleModule,
  ],
  declarations: [NumberOfOrdersTickerComponent],
  exports: [NumberOfOrdersTickerComponent],
})
export class NumberOfOrdersTickerModule { }
