import {
  Component, NgModule, Input, EventEmitter, Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'customer-ticker',
  templateUrl: 'customer-ticker.component.html',
})

export class CustomerTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = null;
  @Input() count: number = 0;
  @Input() dataDetail:any=[];
  @Input() menuitems:any=[];

  @Input() groupData:any=[]; 
  @Input() isGrouped:boolean=false;
  @Input() footerText:string='';
  @Input() columns:any=[];
  @Input() cardColumns:any=[];
  @Input() showTotal:boolean=true;
  @Output() cardSetting= new EventEmitter();


  cardSettingClick(e:any){
    this.cardSetting.emit(e);
  }
}

@NgModule({
  imports: [
    CommonModule,
    TickerCardModule,
    TickerCardSimpleModule
  ],
  declarations: [CustomerTickerComponent],
  exports: [CustomerTickerComponent],
})
export class CustomerTickerModule { }
