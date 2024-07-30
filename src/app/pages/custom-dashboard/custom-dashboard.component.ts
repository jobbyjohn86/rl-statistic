import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgModule, OnDestroy, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DxCheckBoxModule, DxFormModule, DxListModule, DxPopupModule, DxScrollViewModule, DxSortableModule, DxTextBoxModule, DxToolbarModule } from 'devextreme-angular';
import { DxDraggableModule } from 'devextreme-angular/ui/draggable';
import { DxSortableTypes } from 'devextreme-angular/ui/sortable';
import { SaleCardModule } from 'src/app/components/utils/sale-card/sale-card.component';
import { CustomItemComponent } from '../custom-item/custom-item.component';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { ToolbarCanvasModule } from 'src/app/components/utils/toolbar-canvas/toolbar-canvas.component';
// import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import notify from 'devextreme/ui/notify';
import { canvasAllLayout, canvasIndivLayout, canvasType, widgetList } from 'src/app/types/resource';

declare var __moduleName: string;
type DxoItemDraggingProperties = DxSortableTypes.Properties;

// const layHomeBlank = Object.freeze(canvasAllLayout)

@Component({
  selector: 'app-custom-dashboard',
  templateUrl: './custom-dashboard.component.html',
  styleUrls: ['./custom-dashboard.component.scss'],
  // encapsulation: ViewEncapsulation.Emulated,
  // moduleId: __moduleName,
  // preserveWhitespaces: true,
})
export class CustomDashboardComponent implements OnDestroy {

  popupVisible = false;
  popupOpenVisible = false;

  widgetlist = widgetList

  bankCanvas = [];

  canvasRows:any = [];
  // [
  //   { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] },
  //   { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] },
  //   { columns: [{ items: [] }] },
  //   { columns: [{ items: [] }] },
  //   { columns: [{ items: [] }, { items: [] }, { items: [] }] },
  //   { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] }
  // ];

  closeButtonOptions: Record<string, unknown>;
  saveButtonOptions: Record<string, unknown>;
  closeListButtonOptions: Record<string, unknown>;
  saveListButtonOptions: Record<string, unknown>;
  userForm: any = {
    key: 0,
    value: [],
    isdefault: false
  };
  hasNonEmptyNestedArray: boolean = false;
  nestedArrayCheckResults: { hasValues: boolean }[] = [];
  savedLayout = [];
  canvastype = canvasType;
  canvasTypeID=1;

  @ViewChild(DxDataGridComponent, { static: false }) grid: DxDataGridComponent;


  // blankHomeCanvas =  JSON.parse(JSON.stringify(canvasAllLayout));
  // blankLocCanvas =  JSON.parse(JSON.stringify(canvasIndivLayout));

  constructor(private cdr: ChangeDetectorRef) {
    // this.bankCanvas = JSON.parse(JSON.stringify(this.canvasRows));
    this.onAdd = this.onAdd.bind(this);
    this.check4CanvasSave = this.check4CanvasSave.bind(this);
    this.openCanvasList = this.openCanvasList.bind(this);
    this.deleteLayout = this.deleteLayout.bind(this);
    const that = this;
    this.saveButtonOptions = {
      icon: 'save',
      stylingMode: 'contained',
      text: 'Save',
      useSubmitBehavior: true,
      onClick(e: any) {
        let results = e.validationGroup.validate();
        if (results.status == 'valid') {
          that.submitcanvas(e);
        }

      },
    };
    this.closeButtonOptions = {
      text: 'Close',
      stylingMode: 'outlined',
      type: 'normal',
      onClick: () => {
        this.popupVisible = false;
      },
    };

    this.saveListButtonOptions = {
      icon: 'download',
      stylingMode: 'contained',
      text: 'Select',
      useSubmitBehavior: true,
      onClick(e: any) {
        if (that.grid.instance.getSelectedRowsData().length>0) {
          that.popupOpenVisible = false;
          that.canvasRows = that.grid.instance.getSelectedRowsData()[0].value;
          that.userForm.value = that.canvasRows;
          that.userForm.layoutname = that.grid.instance.getSelectedRowsData()[0].key;
          that.userForm.isdefault = that.grid.instance.getSelectedRowsData()[0].default;

          that.canvasRows.map(row => {
            that.widgetlist.map(m => {
              let colVal = row.columns.some(nestedArray => nestedArray && nestedArray.items.some(col => col.id == m.id));
              // console.log(colVal);
              if (colVal) {
                that.widgetlist= that.widgetlist.filter(item => item.id !== m.id);
              }
            });
          });
        }

      },
    };


    this.closeListButtonOptions = {
      text: 'Close',
      stylingMode: 'outlined',
      type: 'normal',
      onClick: () => {
        this.popupOpenVisible = false;
      },
    };


    this.canvasRows = canvasAllLayout;


  }

  ngOnDestroy(): void {
    // document.body.classList.remove('dx-list-items ');
  }


  isTransferComplete: boolean;

  onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  };

  onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
    e.toData.splice(e.toIndex, 0, e.itemData);
  };

  onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
    if (this.isTransferComplete) {
      e.fromData.splice(e.fromIndex, 1);
    }
  };

  onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
    this.onRemove(e as DxSortableTypes.RemoveEvent);
    this.onAdd(e as DxSortableTypes.AddEvent);
  };

  ///

  onCDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
    e.itemData = e.fromData[e.fromIndex];
  };

  onCAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
    this.isTransferComplete = false;
    if (e.toData.length == 0) {
      e.toData.push(e.itemData);//.splice(e.toIndex, 0, e.itemData);
      this.isTransferComplete = true;
      // this.cdr.detectChanges(); 
    }

  };

  onCRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
    e.fromData.splice(e.fromIndex, 1);
  };

  onCReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
    this.onRemove(e as DxSortableTypes.RemoveEvent);
    this.onAdd(e as DxSortableTypes.AddEvent);
  };

  getColumnClass(value: any): string {
    if (value.length > 0) {
      return 'column-green';
    } else {
      return 'column';
    }
  }




  checkNestedArrays(): void {
    this.nestedArrayCheckResults = this.canvasRows.map(item => ({
      hasValues: item.columns.some(nestedArray => nestedArray && nestedArray.items.length > 0)
    }));
    this.hasNonEmptyNestedArray = this.nestedArrayCheckResults.some(result => result.hasValues);
  }

  check4CanvasSave(e: any) {
    this.checkNestedArrays();
    if (!this.hasNonEmptyNestedArray) {
      notify('No Data added in the Canvas', 'error', 2000);
      return;
    }
    this.popupVisible = true;
  }

  submitcanvas(e: any) {
    // console.log(this.userForm);
    let storeData = [];
    let existLayout = localStorage.getItem('canvas');
    if (existLayout != null) {
      storeData = JSON.parse(existLayout);
      storeData = storeData.filter(r => r.key != this.userForm.layoutname);
    }
    if (this.userForm.isdefault) {
      storeData.map(x => {
        x.isdefault = false;
      });
    }
    storeData.push({ key: this.userForm.layoutname, value: this.canvasRows, default: this.userForm.isdefault ,canvasId: this.canvasTypeID});
    localStorage.setItem('canvas', JSON.stringify(storeData));
    this.popupVisible = false;
    if(this.canvasTypeID==1){
      this.canvasRows = canvasAllLayout;
    } else {
      this.canvasRows = canvasIndivLayout;
    }
    // this.canvasRows = this.bankCanvas;
    notify('Canvas Saved Successfully', 'success', 2000);
  }


  openCanvasList() {
    this.savedLayout = JSON.parse(localStorage.getItem('canvas'));
    if (this.savedLayout){
      this.savedLayout= this.savedLayout.filter(r=> r.canvasId== this.canvasTypeID);
    }
    this.popupOpenVisible = true;

  }

  newCanvas() {
    // console.log(layHomeBlank);

    this.checkNestedArrays();
    if (this.hasNonEmptyNestedArray) {
      // if(this.canvasTypeID==1){
      //   this.canvasRows = JSON.parse(JSON.stringify(canvasAllLayout));;
      // } else {
      //   this.canvasRows = JSON.parse(JSON.stringify(canvasIndivLayout));;
      // }
      // // this.cdr.detectChanges();

      // // this.widgetlist = widgetList
      // // if (this.canvasTypeID ==1){
      // //   this.bankCanvas = this.blankHomeCanvas;
      // //   this.canvasRows = this.blankHomeCanvas;
      // // } else {
      // //   this.bankCanvas =this.blankLocCanvas;
      // //   this.canvasRows = this.blankLocCanvas;
      // // }
      this.canvasRows = this.bankCanvas;
    }
  }

  onValueChanged(e) {
    this.userForm.isdefault = e.value;
  }

  onCanvasTypeChange(e){
    this.canvasTypeID= e.id;
    if (e.id==1){
      this.canvasRows = canvasAllLayout;
    } else {
      this.canvasRows = canvasIndivLayout;
    }
  }


  deleteLayout(e){
    let storeData = [];
    let existLayout = localStorage.getItem('canvas');
    if (existLayout != null) {
      storeData = JSON.parse(existLayout);
      storeData = storeData.filter(r => r.key != e.row.key);
      localStorage.setItem('canvas', JSON.stringify(storeData));
      notify('Canvas Deleted Successfully', 'success', 2000);
      this.popupOpenVisible=false;
    }
  }

}

@NgModule({
  imports: [
    DxSortableModule,
    DxDraggableModule,
    SaleCardModule,
    DxListModule,
    CommonModule,
    DxScrollViewModule,
    DxDataGridModule,
    ToolbarCanvasModule,
    DxPopupModule,
    DxTextBoxModule,
    DxFormModule,
    DxCheckBoxModule
  ],
  providers: [],
  exports: [],
  declarations: [CustomDashboardComponent, CustomItemComponent],
})
export class AnalyticsDashboardModule { }


// draggingGroupName = 'appointmentsGroup';

// items = [
//   { id: 1, name: 'Item 1', color: 'red' },
//   { id: 2, name: 'Item 2', color: 'blue' },
//   { id: 3, name: 'Item 3', color: 'green' },
//   { id: 4, name: 'Item 4', color: 'yellow' },
//   { id: 5, name: 'Item 5', color: 'purple' }
// ];

// // Define rows and columns structure
// rows = [
//   { columns: 4 },
//   { columns: 4 },
//   { columns: 1 },
//   { columns: 1 },
//   { columns: 3 },
//   { columns: 4 }
// ];

// canvasItems: any[] = [];

// // onDrop(event) {
// //   const droppedItem = event.itemData;
// //   // You can add additional logic here, such as checking if the item is already in canvasItems
// //   this.canvasItems.push(droppedItem);
// // }

// canvasRows = [
//   { columns: [{ items: [] }, { items: [] }, { items: [] },{ items: [] }] },
//   { columns: [{ items: [] }, { items: [] }, { items: [] },{ items: [] }] },
//   { columns: [{ items: [] }] },
//   { columns: [{ items: [] }] },
//   { columns: [{ items: [] }, { items: [] }, { items: [] }] },
//   { columns: [{ items: [] }, { items: [] }, { items: [] },{ items: [] }] }
// ];

// lists: Task[][] = [];

// statuses = ['Not Started', 'Need Assistance', 'In Progress', 'Deferred', 'Completed'];


// onListReorder(e: DxSortableTypes.ReorderEvent) {
//   const list = this.lists.splice(e.fromIndex, 1)[0];
//   this.lists.splice(e.toIndex, 0, list);

//   const status = this.statuses.splice(e.fromIndex, 1)[0];
//   this.statuses.splice(e.toIndex, 0, status);
// }

// onTaskDragStart(e: DxSortableTypes.DragStartEvent) {
//   e.itemData = e.fromData[e.fromIndex];
// }

// onTaskDrop(e: DxSortableTypes.AddEvent) {
//   e.fromData.splice(e.fromIndex, 1);
//   e.toData.splice(e.toIndex, 0, e.itemData);
// }
// onTaskOrder(e:any){
//   console.log(e);
// }




// onDrop(event: any, rowIndex: number, columnIndex: number) {
//   const droppedItem = event.itemData;

//   if (!droppedItem) {
//     return;
//   }

//   const columnItems = this.canvasRows[rowIndex].columns[columnIndex].items;
//   const itemExists = columnItems.some(item => item.id === droppedItem.id);

//   if (!itemExists) {
//     columnItems.push(droppedItem);
//   }
// }

// onItemDrop(event: any, rowIndex: number, columnIndex: number) {
//   const droppedItem = event.fromData[event.fromIndex];

//   if (!droppedItem) {
//     return;
//   }

//   const columnItems = this.canvasRows[rowIndex].columns[columnIndex].items;
//   const itemExists = columnItems.some(item => item.id === droppedItem.id);

//   if (!itemExists) {
//     columnItems.push(droppedItem);
//     event.fromData.splice(event.fromIndex, 1);
//   }
// }


// // onTaskDragStart(e: DxSortableTypes.DragStartEvent) {
// //   e.itemData = e.fromData[e.fromIndex];
// // }

// // onTaskDrop(e: DxSortableTypes.AddEvent) {
// //   e.fromData.splice(e.fromIndex, 1);
// //   e.toData.splice(e.toIndex, 0, e.itemData);

// //   console.log(e);
// // }



// onDragEnd(e:any){
//   console.log(e);
// }

// onAdds(e:any){
//   console.log(e);
// }

// // getFilteredItems(rowIndex: number, columnIndex: number) {
// //   return this.canvasRows[rowIndex]?.columns[columnIndex]?.items || [];
// // }


// getFilteredItems(rowIndex: number, columnIndex: number) {
//   return () => {
//     const column = this.canvasRows[rowIndex]?.columns[columnIndex];
//     // console.log(this.canvasRows);
//     // console.log(`Filtering items for row: ${rowIndex}, column: ${columnIndex}: ${JSON.stringify(column)}`);
//     return column ? column.items : [];
//   };
// }

// // onDrop(event, rowIndex, columnIndex) {
// //   const droppedItem = event.itemData;
// //   droppedItem.rowIndex = rowIndex; // Assuming rowIndex and columnIndex are passed as arguments
// //   droppedItem.columnIndex = columnIndex;
// //   this.canvasItems.push(droppedItem);
// // }


// onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
//   e.itemData = e.fromData[e.fromIndex];
// };

// onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
//   e.toData.splice(e.toIndex, 0, e.itemData);
//   // console.log(e);

//   // Prevent duplicate items in the same column
//   //  const columnItems = this.canvasRows[rowIndex].columns[columnIndex].items;
//   const itemExists = this.canvasItems.some(item => item.id === e.itemData.id);
//   if (!itemExists) {
//     this.canvasItems.push(e.itemData);
//     // console.log(`Updated column items: ${JSON.stringify(e.itemData)}`);
//   }
//   // this.canvasItems.push(e.itemData);
// };

// onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
//   e.fromData.splice(e.fromIndex, 1);
// };

// onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
//   this.onRemove(e as DxSortableTypes.RemoveEvent);
//   this.onAdd(e as DxSortableTypes.AddEvent);
// };




// // onDrop(e, rowIndex, columnIndex) {
// //   const itemData = e.itemData;
// //   if (!this.canvasItems.some(item => item.id === itemData.id)) {
// //     this.canvasItems.push({ ...itemData, rowIndex, columnIndex });
// //   }
// // }

// // items = [
// //   { id: 1, name: 'Item 1', color: 'red' },
// //   { id: 2, name: 'Item 2', color: 'blue' },
// //   { id: 3, name: 'Item 3', color: 'green' },
// //   { id: 4, name: 'Item 4', color: 'yellow' },
// //   { id: 5, name: 'Item 5', color: 'purple' }
// // ];
// // canvasItems = [];

// // onDrop(e) {
// //   const itemData = e.itemData;
// //   if (!this.canvasItems.some(item => item.id === itemData.id)) {
// //     this.canvasItems.push(itemData);
// //   }
// // }



// // saleCardOptions: DynamicCardOptions = {
// //   cardTitle: 'Sale',
// //   showDateRamge: true,
// //   showPercentage: true,
// //   subHeader: [{ key: 'Target', val: 0 }, { key: 'Achievement', val: 0 }],
// //   dataTable: [{ Particular: 'Today', Invoice: 2, Amount: 102 }],
// //   showTableHeader: false,
// //   footerText: 'Average Ticket Size : ₹ 352',
// //   groupData: false,
// //   showSumOnTop: false,
// //   showCountOnTop: false,
// //   isDetailViewVisible: false,
// //   isDropDownVisible: true,
// //   percentageVal: 0,
// //   countVal: 0,
// //   dropDownMenu: undefined,
// //   columnLimit: undefined,
// //   addTopBlankRowOnCard: false
// // }

// // doingTasks: any[] = [
// //   { id: 1, text: 'Prepare 2019 Financial' },
// //   { id: 2, text: 'Prepare 2019 Marketing Plan' },
// //   { id: 3, text: 'Update Personnel Files' },
// //   { id: 4, text: 'Review Health Insurance Options Under the Affordable Care Act' },
// // ];

// // plannedTasks: any[] = [
// //   { id: 5, text: 'New Brochures' },
// //   { id: 6, text: '2019 Brochure Designs' },
// //   { id: 7, text: 'Brochure Design Review' },
// //   { id: 8, text: 'Website Re-Design Plan' },
// //   { id: 9, text: 'Rollout of New Website and Marketing Brochures' },
// //   { id: 10, text: 'Create 2018 Sales Report' },
// //   { id: 11, text: 'Direct vs Online Sales Comparison Report' },
// //   { id: 12, text: 'Review 2018 Sales Report and Approve 2019 Plans' },
// //   { id: 13, text: 'Submit Signed NDA' },
// //   { id: 14, text: 'Update Revenue Projections' },
// //   { id: 15, text: 'Review Revenue Projections' },
// //   { id: 16, text: 'Comment on Revenue Projections' },
// //   { id: 17, text: 'Scan Health Insurance Forms' },
// //   { id: 18, text: 'Sign Health Insurance Forms' },
// //   { id: 19, text: 'Follow up with West Coast Stores' },
// //   { id: 20, text: 'Follow up with East Coast Stores' },
// //   { id: 21, text: 'Submit Refund Report for 2019 Recall' },
// //   { id: 22, text: 'Give Final Approval for Refunds' },
// //   { id: 23, text: 'Prepare Product Recall Report' },
// //   { id: 24, text: 'Review Product Recall Report by Engineering Team' },
// //   { id: 25, text: 'Review Training Course for any Omissions' },
// //   { id: 26, text: 'Review Overtime Report' },
// //   { id: 27, text: 'Submit Overtime Request Forms' },
// //   { id: 28, text: 'Overtime Approval Guidelines' },
// //   { id: 29, text: 'Create Report on Customer Feedback' },
// //   { id: 30, text: 'Review Customer Feedback Report' },
// //   { id: 31, text: 'Customer Feedback Report Analysis' },
// //   { id: 32, text: 'Prepare Shipping Cost Analysis Report' },
// //   { id: 33, text: 'Complete Shipper Selection Form' },
// //   { id: 34, text: 'Upgrade Server Hardware' },
// //   { id: 35, text: 'Upgrade Personal Computers' },
// //   { id: 36, text: 'Approve Personal Computer Upgrade Plan' },
// //   { id: 37, text: 'Estimate Time Required to Touch-Enable Apps' },
// //   { id: 38, text: 'Report on Tranistion to Touch-Based Apps' },
// //   { id: 39, text: 'Try New Touch-Enabled WinForms Apps' },
// //   { id: 40, text: 'Site Up-Time Report' },
// //   { id: 41, text: 'Review Site Up-Time Report' },
// //   { id: 42, text: 'Review Online Sales Report' },
// //   { id: 43, text: 'Determine New Online Marketing Strategy' },
// //   { id: 44, text: 'Submit New Website Design' },
// //   { id: 45, text: 'Create Icons for Website' },
// //   { id: 46, text: 'Review PSDs for New Website' },
// //   { id: 47, text: 'Create New Shopping Cart' },
// //   { id: 48, text: 'Launch New Website' },
// //   { id: 49, text: 'Update Customer Shipping Profiles' },
// //   { id: 50, text: 'Create New Shipping Return Labels' },
// // ];



// // onDragStart: DxoItemDraggingProperties['onDragStart'] = (e) => {
// //   e.itemData = e.fromData[e.fromIndex];
// // };

// // onAdd: DxoItemDraggingProperties['onAdd'] = (e) => {
// //   e.toData.splice(e.toIndex, 0, e.itemData);
// // };

// // onRemove: DxoItemDraggingProperties['onRemove'] = (e) => {
// //   e.fromData.splice(e.fromIndex, 1);
// // };

// // onReorder: DxoItemDraggingProperties['onReorder'] = (e) => {
// //   this.onRemove(e as DxSortableTypes.RemoveEvent);
// //   this.onAdd(e as DxSortableTypes.AddEvent);
// // };

