import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'mop-ticker',
  templateUrl: 'mop-ticker.component.html',
})

export class MopTickerComponent {
  @Input() data: any = null;
  @Input() isContent: boolean=false;
  @Input() count:number=0;
  @Input() dataDetail: any = [];
  @Input() footerText:string;
  @Input() columns:any=[];
  @Input() cardColumns:any=[];
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
  declarations: [MopTickerComponent],
  exports: [MopTickerComponent],
})
export class MopTickerModule { }
