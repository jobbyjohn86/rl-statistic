import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'taxes-ticker',
  templateUrl: 'taxes-ticker.component.html',
})

export class TaxesTickerComponent {
  @Input() data: any = null;
  @Input() dataDetail:any=[];
  @Input() count : number =0;
  @Input() groupData:any=[]; 
  @Input() isGrouped:boolean=false;
  @Input() footerText:string='';
  @Input() columns :any=[];
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
  declarations: [TaxesTickerComponent],
  exports: [TaxesTickerComponent],
})
export class TaxesTickerModule { }
