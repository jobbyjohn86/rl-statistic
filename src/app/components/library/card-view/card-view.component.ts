import { CommonModule, getCurrencySymbol, getLocaleCurrencySymbol } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { DxButtonModule, DxDataGridModule, DxPopupModule, DxScrollViewModule, DxTextBoxModule } from 'devextreme-angular';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DataService } from 'src/app/services';
import localeEnIN from '@angular/common/locales/en-IN';

@Component({
  selector: 'card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.scss']
})
export class CardViewComponent {
  @Input() items: Array<{ text: string }>;
  @Input() visible = true;
  @Input() isGrouped = false;
  @Input() groupName: string;
  @Input() dataSource: any = [];
  @Input() isCount: boolean = false;
  @Input() columns: any = [];
  popupVisible = false;

  summaryDisplayFormat= 'Total : ₹ {0}'

  constructor(private service: DataService) {
    // console.log(this.groupName); 
    this.formatValue= this.formatValue.bind(this);
  }

  showPopup(e: any) {
    this.popupVisible = true;
    console.log(this.isGrouped);
  }

  isNumber(value: any): boolean {
    return this.service.isNumber(value);
  }

  isCurrency(value: any, key: string): boolean {
    return this.service.isCurrency(value, key);
  }

  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };

  formatValue(value: number): string {
    const formattedValue =this.customInrFormat(value)
    return formattedValue ? formattedValue : value.toString();
  }

  getCurrencySymbol(): string {
    return getCurrencySymbol('INR', 'wide'); // 'wide' ensures you get the full symbol
  }

  
  getSummaryDisplayFormat(): string {
    return `Total: ${this.getCurrencySymbol()} {0}`;
  }


  // customizeText(e:any){
  //   console.log(e);
  //   return 1;
  // }
  // columns: any[] = [
  //   { dataField: 'group', caption: 'Group',groupIndex: 0 },
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'email', caption: 'Email' }
  // ];


}

@NgModule({
  imports: [CommonModule, DxDropDownButtonModule, DxTextBoxModule, DxScrollViewModule, DxButtonModule, DxPopupModule, DxDataGridModule],
  declarations: [CardViewComponent],
  exports: [CardViewComponent],
})
export class CardViewModule { }
