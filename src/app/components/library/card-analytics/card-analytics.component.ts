import { CommonModule } from '@angular/common';
import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { DxButtonModule, DxDateRangeBoxModule, DxPopupModule } from 'devextreme-angular';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { PositionConfig } from 'devextreme/animation/position';
import * as moment from 'moment';
import { DataService } from 'src/app/services';
import { CardMenuModule } from '../card-menu/card-menu.component';
import { CardViewModule } from '../card-view/card-view.component';
@Component({
  selector: 'card-analytics',
  templateUrl: './card-analytics.component.html',
  styleUrls: ['./card-analytics.component.scss'],
})

export class CardAnalyticsComponent {
  @Input() titleText: string;

  @Input() contentClass: string;

  @Input() isMenuVisible = true;

  @Input() isLoading = false;

  @Output() menuClick= new EventEmitter();

  @Input() showDateRange:boolean;

  @Output() cardDateRangeClick = new EventEmitter();

  // @Input() cardID: any;

  startDate: any;
  endDate: any;
  isDateRangeVisble: boolean = false;
  isDateModified: boolean = false;

  constructor(private service:DataService) {
    
    
  }
  
  menuItems: Array<{ name: string, id: number }> = [
    { name: 'Refresh', id: 1 },
    // { name: 'Remove', id: 2 }
  ];


  onMenuItemClick(e: any) {
    this.menuClick.emit(e);
  }

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
    this.cardDateRangeClick.emit([this.startDate, this.endDate]);
    this.isDateModified = true;
  }

  onPopupHiding(e: any) {
    this.isDateRangeVisble = false;
  }

  onDateContainerClick(event: Event, dateRangeBox: any) {
    dateRangeBox.instance.open();
  }
  
  

  position: PositionConfig;
}

@NgModule({
  imports: [
    DxLoadPanelModule,
    CardMenuModule,
    CardViewModule,

    CommonModule,
    DxPopupModule,
    DxDateRangeBoxModule,
    DxButtonModule
  ],
  declarations: [CardAnalyticsComponent],
  exports: [CardAnalyticsComponent],
})
export class CardAnalyticsModule { }
