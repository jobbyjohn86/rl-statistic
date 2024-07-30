import { Component, NgModule, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService, ScreenService } from 'src/app/services';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTabsModule } from 'devextreme-angular/ui/tabs';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { DxTabsTypes } from 'devextreme-angular/ui/tabs';

import { canvasType, Dates, PanelItem } from 'src/app/types/resource';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Location } from '@angular/common';
import { AppAccessModule } from '../../library/app-access/app-access.component';
import { DxDataGridModule, DxDropDownBoxModule } from 'devextreme-angular';

@Component({
  selector: 'toolbar-canvas',
  templateUrl: './toolbar-canvas.component.html',
  styleUrls: ['./toolbar-canvas.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
})

export class ToolbarCanvasComponent implements OnInit {
  @Input() titleText: string;

  @Output() saveCanvas = new EventEmitter<any>();
  @Output() openCanvasList = new EventEmitter<any>();
  @Output() createCanvas = new EventEmitter<any>();
  canvastypes: any = canvasType;
  @Output() canvasTypeChanged = new EventEmitter<any>();


  isAccessRequired: boolean = false;
  canvasSelectedValue: ''

  constructor(protected screen: ScreenService, private location: Location, private service: DataService) {
    this.typeChange = this.typeChange.bind(this);
  }

  ngOnInit(): void {

  }

  save(e: any) {
    this.saveCanvas.emit(e);
  }

  open() {
    this.openCanvasList.emit();
  }

  create() {
    this.createCanvas.emit();
  }


  typeChange(e: any) {
    this.canvasTypeChanged.emit(e.item);
  }


}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxTabsModule,
    DxToolbarModule,
    AppAccessModule,
    DxDropDownBoxModule,
    DxDataGridModule
  ],
  declarations: [ToolbarCanvasComponent],
  exports: [ToolbarCanvasComponent],
})
export class ToolbarCanvasModule { }
