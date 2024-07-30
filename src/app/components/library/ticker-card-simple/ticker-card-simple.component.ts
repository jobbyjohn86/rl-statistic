import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { CardAnalyticsModule } from '../card-analytics/card-analytics.component';
import { ApplyPipeModule } from "src/app/pipes/apply.pipe";
import { CardMenuModule } from '../card-menu/card-menu.component';
import { CardViewModule } from '../card-view/card-view.component';
import { DxButtonModule, DxDateRangeBoxModule, DxPopupModule } from 'devextreme-angular';
import { DataService } from 'src/app/services';
import * as moment from 'moment';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'ticker-card-simple',
  templateUrl: './ticker-card-simple.component.html',
  styleUrls: ['./ticker-card-simple.component.scss'],
  animations: [
    trigger('hoverTextChange', [
      state('default', style({
        opacity: 1,
        transform: 'scale(1) rotate(0deg) translate(0, 0)'
      })),
      state('hovered', style({
        opacity: 0,
        transform: 'scale(1.2) rotate(10deg) translate(10px, 10px)'
      })),
      transition('default <=> hovered', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})

export class TickerCardSimpleComponent implements AfterViewInit {

  @Input() titleText: string;

  // @Input() data: SalesOrOpportunitiesByCategory | Sales | null = null;
  @Input() data: any | null = null;

  @Input() total: string | null = null;

  @Input() percentage: number;

  @Input() icon: string;

  @Input() tone?: 'warning' | 'info';

  @Input() contentClass: string | null = null;

  @Input() isMenuVisible = true;

  @Input() count: number;

  @Input() isContent: boolean = false;

  @Input() menuItems: any = [];

  @Input() detailsItems: any = [];

  @Input() isDetailsVisible = false;

  @Input() groupData: any = [];

  @Input() isGrouped: boolean = false;

  @Input() isCount: boolean = false;

  @Input() footerText: string = '';

  @Input() columns: any = [];

  @Input() cardColumns: any = [];

  @Input() showTotal: boolean = true;

  @Output() cardSettingClick = new EventEmitter();

  // menuItems: Array<{ text: string,value:string }> = [
  //   { text: 'My Account',value:'0' },
  //   { text: 'Discount',value:'0' },
  //   { text: 'Delivery Charges',value:'0' },
  //   { text: 'Container Charges',value:'0' },
  //   { text: 'Service Charges' ,value:'0'},
  //   { text: 'Tax',value:'0' },
  //   { text: 'Waived Off',value:'0' },
  //   { text: 'Round Off' ,value:'0'},
  //   { text: 'Total Sale',value:'0' },
  // ];

  @Input() details: any = [];

  @Input() hrefLink:string='';

  blankRow: any = [];

  isDateRangeVisble: boolean = false;


  startDate: any;
  endDate: any;

  isHovered:boolean=false;
  hoverText:string='';

  constructor(private service: DataService,private router: Router) {
  }

  ngAfterViewInit(): void {
    let _filnumber = 4 - this.groupData.length;
    this.blankRow = Array.from({ length: _filnumber }, (value, index) => index + 1);
    // console.log(this.blankRow);
  }


  getTotal(data: Array<{ value?: number, total?: number }>): number {
    return (data || []).reduce((total, item) => total + (item.value || item.total), 0);
  }

  abs(value: number): number {
    return Math.abs(value);
  }

  getIconClass = () => this.tone || (this.percentage >= 0 ? 'positive' : 'negative');

  getNumberFormat(val: any) {
    return this.service.getNumberFormat(val);
  }

  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };


  // selectedDateRange: DateRange;
  // applyValueMode: ApplyValueMode;
  // pickerType: PickerType;


  onIconClick() {
    this.startDate = this.service.selectedDates[0];
    this.endDate = this.service.selectedDates[1];
    this.isDateRangeVisble = true;
  }

  handleValueChange(e) {
    if (e.value[0]) { this.startDate = moment(e.value[0]).format("YYYY-MM-DD"); }
    if (e.value[1]) { this.endDate = moment(e.value[1]).format("YYYY-MM-DD"); }
  }
  onSaveClick() {
    this.isDateRangeVisble = false;
    this.cardSettingClick.emit([this.startDate, this.endDate]);
  }

  onPopupHiding(e: any) {
    this.isDateRangeVisble = false;
  }

  onDateContainerClick(event: Event, dateRangeBox: any) {
    dateRangeBox.instance.open();
  }
  

  onFooterClick(){
    // const url = this.router.serializeUrl(
    //   this.router.createUrlTree([this.hrefLink])
    // );
    // window.open(url, '_blank');
    // ========== to do later, router link have to make in Mobi 23/05/24 ============
    // sessionStorage['cmbReportID']='59';
    // sessionStorage['cmbReportHEader']='Cash and Bank Summary';
    // window.open(this.hrefLink, '_blank', 'noopener,noreferrer');
  }

  onMouseOver() {
    this.isHovered = true;
    setTimeout(() => {
      this.hoverText = 'You are hovering!';
      this.isHovered = false; // Reset the animation state
    }, 500); // Wait for the fade-out animation to complete
  }

  onMouseOut() {
    this.isHovered = false;
    setTimeout(() => {
      this.hoverText = 'Hover over me!';
    }, 500); // Wait for the fade-out animation to complete
  }


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
    DxButtonModule
  ],
  declarations: [TickerCardSimpleComponent],
  exports: [TickerCardSimpleComponent],
})
export class TickerCardSimpleModule { }
