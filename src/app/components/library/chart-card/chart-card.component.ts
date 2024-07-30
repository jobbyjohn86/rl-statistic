import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { CardAnalyticsModule } from '../card-analytics/card-analytics.component';
import { ApplyPipeModule } from "src/app/pipes/apply.pipe";
import { CardMenuModule } from '../card-menu/card-menu.component';
import { CardViewModule } from '../card-view/card-view.component';
import { DataService } from 'src/app/services';
import * as moment from 'moment';
import { DxButtonModule, DxDateRangeBoxModule, DxPopupModule } from 'devextreme-angular';

@Component({
  selector: 'chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss'],
})

export class  ChartCardComponent implements OnInit, AfterViewInit {
  @Input() isLoading = false;


  
  @Input() titleText: string;

  @Input() data: any | null = null;

  @Input() total: string | null = null;

  @Input() percentage: number;

  @Input() icon: string;

  @Input() tone?: 'warning' | 'info';

  @Input() contentClass: string | null = null;

  @Input() isMenuVisible = true;

  @Input() count: number;

  @Input() dataDetail :any;

  @Input() menuItems: Array<{ name: string,value:string }>;

  @Input() detailsItems: any=[];

  @Input() isDetailsVisible=false;

  @Input() dataSource:any=[];

  @Input() footerText:string='';
  
  @Input() columns:any=[];

  @Output() cardSettingClick = new EventEmitter();
  
  blankRow:any=[];

  startDate: any;
  endDate: any;
  isDateRangeVisble: boolean = false;

  constructor(private service: DataService) {}

  ngOnInit(): void {
    // if(this.dataDetail.length>0){
    //   console.log(this.dataDetail);
    //   console.log(this.dataDetail.length);

      this.blankRow = Array(4).fill(2)
    //   console.log(this.blankRow.length);
    // } 
  }
   
  ngAfterViewInit(): void {
    // console.log(this.dataDetail);
  }
  


  getTotal(data: Array<{value?: number, total?: number}> ): number {
    return (data || []).reduce((total, item) => total + (item.value || item.total), 0);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  getIconClass = () => this.tone || (this.percentage >= 0 ? 'positive' : 'negative');


  onIconClick() {
    this.startDate = this.service.selectedDates[0];
    this.endDate = this.service.selectedDates[1];
    this.isDateRangeVisble = true;
  }

  handleValueChange(e) {
    if(e.value[0]){ this.startDate = moment(e.value[0]).format("YYYY-MM-DD"); }
    if(e.value[1]){ this.endDate = moment(e.value[1]).format("YYYY-MM-DD");  }
  }
  onSaveClick() {
    this.isDateRangeVisble = false;
    this.cardSettingClick.emit([this.startDate, this.endDate]);
  }

  onPopupHiding(e: any) {
    this.isDateRangeVisble = false;
  }
  
  // getCount(data: Array<{count?: number, total?: number}> ): number{
  //   return (data || []).reduce((total, item) => total + (item.count || item.total), 0);
  // }
}

@NgModule({
  imports: [
    CardAnalyticsModule,
    ApplyPipeModule,
    CardMenuModule,
    CardViewModule,

    CommonModule,
    DxPopupModule,
    DxDateRangeBoxModule,
    DxButtonModule,
  ],
  declarations: [ChartCardComponent],
  exports: [ChartCardComponent],
})
export class ChartCardModule { }
