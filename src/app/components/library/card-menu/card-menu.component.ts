import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';
import { DxBoxModule, DxDataGridModule, DxTextBoxModule } from 'devextreme-angular';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';


@Component({
  selector: 'card-menu',
  templateUrl: './card-menu.component.html',
  styleUrls: ['./card-menu.component.scss']
})
export class CardMenuComponent {
  @Input() items: any=[];
  @Input() visible = true;

  @Output() menuClick= new EventEmitter();

  constructor() { }

  onMenuItemCLick(e:any){
    this.menuClick.emit(e);
  }
}

@NgModule({
  imports: [DxDropDownButtonModule,DxTextBoxModule,DxBoxModule,CommonModule],
  declarations: [CardMenuComponent],
  exports: [CardMenuComponent],
})
export class CardMenuModule { }
