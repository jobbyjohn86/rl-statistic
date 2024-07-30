import {
  Component, NgModule, Input, Output, EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
// import { SalesOrOpportunitiesByCategory } from 'src/app/types/analytics';
import { TickerCardModule } from 'src/app/components/library/ticker-card/ticker-card.component';
import { TickerCardSimpleModule } from '../../library/ticker-card-simple/ticker-card-simple.component';

@Component({
  selector: 'feedback-ticker',
  templateUrl: 'feedback-ticker.component.html',
})

export class FeedbackTickerComponent {
  @Input() data: any = null;
  @Input() percentage: number = null;
  @Input() count: number = 0;
  @Input() dataDetail:any=[];
  @Input() menuitems:any=[];

  @Input() groupData:any=[]; 
  @Input() isGrouped:boolean=false;
  @Input() footerText: string='';
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
    TickerCardModule,
    TickerCardSimpleModule
  ],
  declarations: [FeedbackTickerComponent],
  exports: [FeedbackTickerComponent],
})
export class FeedbackTickerModule { }
