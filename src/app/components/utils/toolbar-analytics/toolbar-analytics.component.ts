import { Component, NgModule, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService, ScreenService } from 'src/app/services';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { DxTabsTypes } from 'devextreme-angular/ui/tabs';

import { Dates, PanelItem } from 'src/app/types/resource';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Location } from '@angular/common';
import { AppAccessModule } from '../../library/app-access/app-access.component';

@Component({
  selector: 'toolbar-analytics',
  templateUrl: './toolbar-analytics.component.html',
  styleUrls: ['./toolbar-analytics.component.scss']
})

export class ToolbarAnalyticsComponent implements OnInit {
  @Input() selectedItems: Array<number>;

  @Input() titleText: string;

  @Input() panelItems: Array<PanelItem>;

  @Output() selectionChanged = new EventEmitter<Dates>();

  locationData: any = [];
  @Output() locationChanged = new EventEmitter<any>();

  @Input() isDisplayLocation: boolean = true;

  @Input() showBackButton: boolean = false;

  @Output() refresh = new EventEmitter<any>();

  isAccessRequired: boolean = false;

  constructor(protected screen: ScreenService, private location: Location, private service: DataService) {
    this.locationChange = this.locationChange.bind(this);
    let _location: any = JSON.parse(localStorage.getItem('location'));
    _location.map(r => {
      this.locationData.push({ name: r.LocationName, value: r.LocationID });
    })
    this.goBack = this.goBack.bind(this);
    this.refreshPage = this.refreshPage.bind(this);
    this.updateRCID= this.updateRCID.bind(this);
  }
  ngOnInit(): void {
    if(this.panelItems){
      this.service.selectedDates = this.panelItems[0]?.value.split('/');
    }
  }

  selectionChange(e: DxTabsTypes.SelectionChangedEvent) {
    const dates = e.addedItems[0].value.split('/');
    this.service.selectedDates = dates;
    this.selectionChanged.emit({ startDate: dates[0], endDate: dates[1] });
  }

  goBack(e: any): void {
    this.location.back();
  }


  // locationChange(e: any) {
  //   this.locationChanged.emit(2);
  //   // this.locationChanged.emit({ startDate: '2021-01-01', endDate: '2021-01-01' });

  //   // this.selectionChanged.emit(e.value);
  //   // if (e.value > 0) {
  //   //   this.selectionChanged.emit(e.value);
  //   //   // this.router.navigate(['/analytics-sales-report']);
  //   //   // this.selectionChanged.emit(e.value);
  //   // } else {
  //   //   this.router.navigate(['/analytics-dashboard']);
  //   // }
  // }


  // @Output() eventEmitter: EventEmitter<any> = new EventEmitter();

  locationChange(e: any) {
    this.locationChanged.emit(e.value);
  }

  refreshPage() {
    this.refresh.emit();
  }

  updateRCID() {
    this.isAccessRequired = true;
  }

}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxTabsModule,
    DxToolbarModule,
    AppAccessModule
  ],
  declarations: [ToolbarAnalyticsComponent],
  exports: [ToolbarAnalyticsComponent],
})
export class ToolbarAnalyticsModule { }
