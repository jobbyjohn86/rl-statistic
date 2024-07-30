import { Component, Input, NgModule, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxSortableModule } from 'devextreme-angular/ui/sortable';

@Component({
  selector: 'app-custom-item',
  templateUrl: './custom-item.component.html',
  styleUrls: ['./custom-item.component.scss']
})
export class CustomItemComponent implements OnChanges {

  @Input() canvasItems: any;
  @Input() row: any;
  @Input() column: any;
  // @Input() items: any[] = [];


  @Input() filterItems: () => any[];
  // items: any[];
  @Input() items: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterItems'] && this.filterItems) {
      // this.items = this.filterItems();
      // console.log(`Filtered items: ${JSON.stringify(this.items)}`);
    }
    // if (changes.filterItems && this.filterItems) {
    //   this.items = this.filterItems();
    // }
  }


  // getFilteredItems(row, column) {
  //   console.log(row);
  //   console.log(column);
  //   console.log(this.canvasItems);
  //   return null
  //   // return this.canvasItems.filter((item, index) => index % row.columns.length === column.index);

  //   // Perform filtering based on the provided row and column information
  //   // return this.canvasItems.filter(item => /* Your filtering condition */);
  // }


}


// @NgModule({
//   imports: [
//     // DxListModule,
//     // DxSortableModule
//   ],
//   providers: [],
//   exports: [],
//   declarations: [CustomItemComponent],
// })
// export class CustomItemModule { }


