import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'sale-by-shift-ticker',
  templateUrl: 'sale-by-shift-ticker.component.html',
})

export class SaleByShiftTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = 0;
  @Input() count: number = 0;
  @Input() details: any = [];
  @Input() titleText: string = 'Sale By Shift';
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
  declarations: [SaleByShiftTickerComponent],
  exports: [SaleByShiftTickerComponent],
})
export class SaleByShiftTickerModule { }
