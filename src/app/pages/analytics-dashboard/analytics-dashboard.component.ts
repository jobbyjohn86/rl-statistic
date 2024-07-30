import {
  Component, OnInit, NgModule, ChangeDetectorRef, ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { map, share } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';

import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxFunnelModule } from 'devextreme-angular/ui/funnel';
import { DxBulletModule } from 'devextreme-angular/ui/bullet';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';

import { DataService } from 'src/app/services';
import { CardAnalyticsModule } from 'src/app/components/library/card-analytics/card-analytics.component';
import { ToolbarAnalyticsModule } from 'src/app/components/utils/toolbar-analytics/toolbar-analytics.component';
import { analyticsPanelItems, ChartOptions, Dates, DynamicCardOptions, preLayoutAllLocation } from 'src/app/types/resource';
import { ApplyPipeModule } from 'src/app/pipes/apply.pipe';

import { TotalSaleTickerModule } from 'src/app/components/utils/total-sale-ticker/total-sale-ticker.component';
import { CashCollectionTickerModule, MopTickerModule, NetSaleTickerModule, NumberOfOrdersTickerModule, OnlineSaleTickerModule, RevenueAnalysisCardModule, SaleGraphCardModule, SalesByRangeCardModule, TaxesTickerModule } from 'src/app/components';
import { TotalPurchaseTickerModule } from 'src/app/components/utils/total-purchase-ticker/total-purchase-ticker.component';
import { TopSaleTickerModule } from 'src/app/components/utils/total-sale-ticker/top-sale-ticker/top-sale-ticker.component';
import * as moment from 'moment';
import { FeedbackTickerModule } from 'src/app/components/utils/feeback-ticker/feedback-ticker.component';
import { CustomerTickerModule } from 'src/app/components/utils/customer-ticker/customer-ticker.component';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';
import { SaleCardModule } from 'src/app/components/utils/sale-card/sale-card.component';
import { cashBankOptions, customerOptions, feedbackOptions, mopOptions, ordersOptions, purchaseOptions, ratioAnalysisOptions, saleOptions, shiftCardOptions, supplierCardOptions, taxDiscountOptions, topSaleOptions } from 'src/app/types/cardoptions';
import { SaleByTimeCardModule } from 'src/app/components/utils/sales-by-time-card/sales-by-time-card.component';
import { feedackGraphCardOption, saleByBrandOptions, saleByCustAreaOption, saleByDepartmentOptions, saleByGroupOptions, saleBySubGroupOptions, saleByTicketOptions, saleByTimeOptions, saleWeekDayGraphCardOption } from 'src/app/types/chartoptions';
import { FraudCotrolCardlistModule } from 'src/app/components/utils/fraud-cotrol-cardlist/fraud-cotrol-cardlist.component';


type DashboardData = any | null;
type DataLoader = (startDate: string, endDate: string, location: number) => Observable<any>;

@Component({
  templateUrl: './analytics-dashboard.component.html',
  styleUrls: ['./analytics-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AnalyticsDashboardComponent implements OnInit {
  analyticsPanelItems = analyticsPanelItems;
  isLoading: boolean = false;
  saleDetail: any = []
  purchaseDetail: any = [];
  totalPurchase: any = [];
  purchaseReturn: any = [];
  discountDetail: any = [];
  saleMenu: any = [];
  saleAnalysisData: any = [];

  // live data objects
  allLocationSale: any = [];
  totalSalesDetails: any = [];
  totalSales: any = [];
  saleInvoiceCount: number = 0;

  paymentMode: any = [];
  paymentModeDetails: any = [];

  orders: any = [];
  orderDetails: any = [];
  orderCount: any = '0';

  topSales: any = [];
  topSalesDetails: any = [];
  topCategoryAvg: number = 0;

  taxAndDisc: any = [];
  taxAndDiscDetails: any = [];
  totalDicCount: number = 0;

  feedbackCount: number = 0;
  feedbackDetails: any = [];

  customerCount: number = 0;
  customerData: any = [];

  saleChart: any = [];

  // selectedLocationId: number = 0;

  targetValue: number = 0;
  targetPercentage: number = 0;

  multiLocationData: any = [];

  visualRange: unknown = {};



  //---------- new dynamic card options -----------//
  saleCardOptions: DynamicCardOptions = saleOptions;
  purchaseCardOptions: DynamicCardOptions = purchaseOptions;
  ordersCardOptions: DynamicCardOptions = ordersOptions;
  mopCardOptions: DynamicCardOptions = mopOptions;
  taxDiscountCardOptions: DynamicCardOptions = taxDiscountOptions;
  topSaleCardOptions: DynamicCardOptions = topSaleOptions;//--
  feedbackCardOption: DynamicCardOptions = feedbackOptions;
  customerCardOption: DynamicCardOptions = customerOptions;
  cashBankCardOption: DynamicCardOptions = cashBankOptions;
  ratioCardOption: DynamicCardOptions = ratioAnalysisOptions;
  supplierCardOptions: DynamicCardOptions = supplierCardOptions;
  shiftCardOptions: DynamicCardOptions = shiftCardOptions;


  // graph options //
  saleByTimeOptions: ChartOptions = saleByTimeOptions;
  saleByTicketOptions: ChartOptions = saleByTicketOptions;
  saleByDepartmentOptions: ChartOptions = saleByDepartmentOptions;
  saleByGroupOptions: ChartOptions = saleByGroupOptions;
  saleBySubGroupOptions: ChartOptions = saleBySubGroupOptions;
  saleByBrandOptions: ChartOptions = saleByBrandOptions;
  saleByCustAreaOption: ChartOptions = saleByCustAreaOption;
  feedackGraphCardOption: ChartOptions = feedackGraphCardOption;
  saleWeekDayGraphCardOption: ChartOptions = saleWeekDayGraphCardOption;



  layout: any = [];
  selectedDateRange: any = [];

  constructor(private service: DataService, private router: Router,private cdr: ChangeDetectorRef) {
    let existLayout = localStorage.getItem('canvas');
    if (existLayout != null) {
      let _lay = JSON.parse(existLayout).filter(r => r.default == true && r.canvasId == 1).length > 0 ? JSON.parse(existLayout).filter(r => r.default == true && r.canvasId == 1)[0]?.value : preLayoutAllLocation;
      this.layout = _lay;
      console.log(JSON.stringify(this.layout));
    } else {
      this.layout = preLayoutAllLocation;
    }

    // console.log(this.layout)

  }

  selectionChange(dates: Dates) {
    this.selectedDateRange = dates;
    this.cdr.detectChanges();


    // console.log(dates);
    // this.service.changeDate(dates);
    // this.service.selectedDates = dates.startDate +'/'+ dates.endDate;
    // this.loadData1(dates.startDate, dates.endDate);
  }

  customizeSaleText(arg: { percentText: string }) {
    return arg.percentText;
  }

  // ['sales', this.service.getSales],
  //     ['salesByCategory', this.service.getSalesByCategory]

  loadData1 = (startDate: string, endDate: string) => {
    this.isLoading = true;
    // const tasks: Observable<any>[] = [
    //   ['allLocationSale', this.service.getAllLocationSales]
    // ].map(([dataName, loader]: [string, DataLoader]) => {
    //   const loaderObservable = loader(startDate, endDate).pipe(share());

    //   loaderObservable.subscribe((result: any) => {
    //     this[dataName] = result;
    //     console.log(this.allLocationSale)
    //   });

    //   return loaderObservable;
    // });



    // forkJoin(tasks).subscribe(() => {
    //   this.isLoading = false;
    // });


    // console.log(this.layout);

    const tasks: Observable<any>[] = [
      ['allLocationSale', (s: string, e: string, num: number) => this.service.getAllLocationSales(s, e)],
      ['getSaleByServiceType', (s: string, e: string, num: number) => this.service.getSaleByServiceType(s, e, 0)],
      ['getTotalSales', (s: string, e: string, num: number) => this.service.getTotalSales(s, e, 0)], //getTotalSales
      ['getSaleByMOP', (s: string, e: string, num: number) => this.service.getSaleByMOP(s, e, 0)],
      ['getSaleByItem', (s: string, e: string, num: number) => this.service.getSaleByItem(s, e, 0)],
      ['getTaxAndDisount', (s: string, e: string, num: number) => this.service.getTaxAndDisount(s, e)],
      ['getFeedback', (s: string, e: string, num: number) => this.service.getFeedback(s, e, 0)],
      ['getCustomes', (s: string, e: string, num: number) => this.service.getCustomes(s, e, 0)],
      ['getmultiLocationData', (s: string, e: string, num: number) => this.service.getmultiLocationData(s, e, 0)],
      ['getPurchase', (s: string, e: string, num: number) => this.service.getPurchase(s, e, 0)]
    ].map(([dataName, loader]: [string, DataLoader]) => {
      const loaderObservable = loader(startDate, endDate, 0).pipe(share());
      loaderObservable.subscribe((result: any) => {
        // this[dataName] = result;
        switch (dataName) {
          case 'allLocationSale':
            this.allLocationSale = JSON.parse(result.ExecuteMobiDataResult);
            // console.log(this.allLocationSale);
            this.allLocationSale.map((r: any) => {
              this.saleChart.push({ name: r.LocationName, value: r.NetSales });
            });
            break;
          case 'getSaleByServiceType':
            // this.getTargetValue(result.ExecuteMobiDataResult[1]);
            this.getOrderDetails(result.ExecuteMobiDataResult[0], startDate, endDate)
            break;
          case 'getTotalSales':
            this.getSaleDetails(result.ExecuteMobiDataResult[0], startDate, endDate); // taking the same data from Sale By Type
            break;
          case 'getSaleByMOP':
            this.getSaleMOPDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
            break;
          case 'getSaleByItem':
            this.getItemSalesDetails(result.ExecuteMobiDataResult[0]);
            break;
          case 'getTaxAndDisount':
            this.getTaxAndDiscounts(result.ExecuteMobiDataResult);
            break;
          case 'getFeedback':
            this.getFeedBackDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
            break;
          case 'getCustomes':
            this.getCustomerDetails(result.ExecuteMobiDataResult);
            break;
          case 'getmultiLocationData':
            this.multiLocationData = JSON.parse(result.ExecuteMobiDataResult[0]);
            break;
          case 'getPurchase':
            this.getPurchaseDetails(JSON.parse(result.ExecuteMobiDataResult[0])[2], startDate, endDate);
            this.purchaseReturn = JSON.parse(result.ExecuteMobiDataResult[0])[3];
            if (this.purchaseReturn) {
              this.purchaseCardOptions.footerText = "Return:" + this.purchaseReturn?.TodayMemo + "| Amount: " + this.purchaseReturn?.TodayAmt;
            } else {
              this.purchaseCardOptions.footerText = "Return: 0 | Amount: 0";
            }

            break;
        }

      }, error => {
        // console.log(error);
        notify(error.error + ', Please Try Again', 'error', 2000);
      });
      return loaderObservable;
    });


    forkJoin(tasks).subscribe(() => {
      this.isLoading = false;
    }, error => this.isLoading = false);
  };


  getTargetValue(data: any) {
    let _targetValue = JSON.parse(data);
    if (_targetValue.length > 0) {
      this.targetValue = _targetValue.map(a => a.BudgetAmt).reduce((a, b) => Math.max(a, b));
    }
  }

  getOrderDetails(data: any, startDate: any, endDate: any) {
    this.orderDetails = [];
    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
        return a + b;
      });
      this.orders = [{ name: 'Orders', value: filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; }) }];
      this.orderCount = filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; });//sum;//
      const summary = new Map<string, number>();
      filterData.forEach(transaction => {
        const { SaleMode, TodayAmt } = transaction;
        const currentSum = summary.get(SaleMode) || 0;
        summary.set(SaleMode, currentSum + TodayAmt);
      });
      let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
      _orderDetails.map(x => {
        let _count = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
        let _amt = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
        let _contr = (_amt / sum) * 100;
        let _tickets = (x.value / _count).toFixed(2);
        this.orderDetails.push({ name: x.name, orders: _count, value: x.value, ticket: parseFloat(_tickets), contribution: parseFloat(_contr.toFixed(2)) })
        this.orderDetails = this.orderDetails.sort((a, b) => b.value - a.value)
      });

    } else {
      this.orders = [{ name: 'Orders', value: '0' }];
      this.orderCount = 0
      this.orderDetails = [];
    }

    this.ordersCardOptions.dataTable = this.orderDetails;
    this.ordersCardOptions.countVal = this.orderCount;
    let _footer = this.orderDetails.length > 0 ? this.orderDetails[0].name : '';
    this.ordersCardOptions.footerText = "Highest Order : " + _footer;
    console.log(this.ordersCardOptions);
  }

  getSaleDetails(data: any, startDate: any, endDate: any) {
    this.saleInvoiceCount = 0;
    this.totalSales = [];
    this.saleDetail = [];
    let _totalSales = JSON.parse(data);

    let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    // console.log(filterData);
    if (filterData.length > 0) {

      let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
        return a + b;
      });

      this.totalSales = [{ name: 'Total Sales', value: sum }];
      this.targetPercentage = this.targetValue == 0 ? 100 : parseInt(((sum / this.targetValue) * 100).toFixed(0))

      console.log(filterData);

      this.saleDetail.push(
        // { name: 'Target', value: this.targetValue },
        { name: 'Today', count: filterData.map(a => a.TodayInvoice).reduce((a, b) => Math.max(a, b)), value: filterData.map(a => a.TodayBillAmount).reduce((a, b) => Math.max(a, b)) },
        { name: 'MTD', count: filterData.map(a => a.MTDInvoice).reduce((a, b) => Math.max(a, b)), value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) },
        { name: 'YTD', count: filterData.map(a => a.YTDInvoice).reduce((a, b) => Math.max(a, b)), value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });

      //  this.saleDetail.push(
      //   { 
      //     name: 'Today', 
      //     count: filterData.map(a => a.TodayBill).reduce((a, b) => Math.max(a, b)), 
      //     value: filterData.map(a => a.TodayAmt).reduce((a, b) => Math.max(a, b)) 
      //   },
      //   { 
      //     name: 'MTD', 
      //     count: filterData.map(a => a.MTDBill).reduce((a, b) => Math.max(a, b)), 
      //     value: filterData.map(a => a.MTDAmt).reduce((a, b) => Math.max(a, b)) },
      //   { 
      //     name: 'YTD', 
      //     count: filterData.map(a => a.YTDBill).reduce((a, b) => Math.max(a, b)), 
      //     value: filterData.map(a => a.YTDAmt).reduce((a, b) => Math.max(a, b)) 
      //   });


      filterData.map(a => {
        // this.saleDetail.push({ name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) }, { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });
        this.saleInvoiceCount = filterData.map(a => a.TodayInvoice).reduce(function (a, b) { return a + b; });
        let _todayTotal = filterData.map(a => a.TodayBillAmount).reduce((a, b) => Math.max(a, b));
        let _discount = filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; });
        let _expense = filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; });
        let _tax = filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; });
        let _void = filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; });

        let _gross = _todayTotal + _discount - _expense - _tax - _void;
        //filterData.map(a => a.TodayGrossAmount).reduce((a, b) => { return a + b; })
        this.saleMenu = [
          { name: 'Gross Amount', value: _gross },
          { name: 'Discount', value: filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; }) },
          { name: 'Expense', value: filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; }) },
          { name: 'Tax', value: filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; }) },
          { name: 'Voids', value: filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; }) },
        ];
      })

      this.saleInvoiceCount = this.saleDetail[0].value / this.saleDetail[0].count;

    } else {
      this.totalSales = [{ name: 'Total Sales', value: '0' }];
      this.saleInvoiceCount = 0;
      this.saleDetail.push(
        // { name: 'Target', value: 0 },
        { name: 'Today', value: 0 },
        { name: 'MTD', value: 0 },
        { name: 'YTD', value: 0 });

      this.saleMenu = [
        { name: 'Gross Amount', value: '0' },
        { name: 'Discount', value: '0' },
        { name: 'Expense', value: '0' },
        { name: 'Tax', value: '0' },
        { name: 'Voids', value: '0' },
      ];
    }

    // this.saleCardOptions.dataTable = this.saleDetail;
    // this.saleCardOptions.dropDownMenu = this.saleMenu;
    // this.saleCardOptions.percentageVal = this.targetPercentage;
    // this.saleCardOptions.subHeader = [{ key: 'Target', val: this.targetValue }, { key: 'Achievement', val: this.saleDetail[0].value }]
    // this.saleCardOptions.footerText = 'Average Ticket Size : ' + this.service.customInrFormat(this.saleInvoiceCount);


  }

  getPurchaseDetails(data: any, startDate: any, endDate: any) {
    this.totalPurchase = [];
    this.purchaseDetail = [];
    let _totalPurchase = data;
    if (_totalPurchase) {
      this.totalPurchase = [{ name: 'Total Purchase', value: _totalPurchase.TodayAmt }];
      this.purchaseDetail.push(
        // { name: 'Target', count: 0 ,value: 0},
        { name: 'Today', count: _totalPurchase.TodayMemo, value: _totalPurchase.TodayAmt },
        { name: 'MTD', count: _totalPurchase.MTDMemo, value: _totalPurchase.MTDAmt },
        { name: 'YTD', count: _totalPurchase.YTDMemo, value: _totalPurchase.YTDAmt });
    } else {
      this.totalPurchase = [{ name: 'Total Purchase', value: 0 }];
      this.purchaseDetail.push(
        // { name: 'Target', count: 0, value: 0 },
        { name: 'Today', count: 0, value: 0 },
        { name: 'MTD', count: 0, value: 0 },
        { name: 'YTD', count: 0, value: 0 });
    }


    this.purchaseCardOptions.dataTable = this.purchaseDetail;

    // let filterData = _totalPurchase.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    // // console.log(filterData);
    // if (filterData.length > 0) {
    //   let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
    //     return a + b;
    //   });

    //   this.totalSales = [{ name: 'Total Sales', value: sum }];
    //   this.targetPercentage = this.targetValue == 0 ? 100 : parseInt(((sum / this.targetValue) * 100).toFixed(0))

    //   // console.log(filterData);

    //   this.saleDetail.push(
    //     { name: 'Target', value: this.targetValue },
    //     { name: 'Today', value: filterData.map(a => a.TodayNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.TodayInvoice).reduce((a, b) => Math.max(a, b)) },
    //     { name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.MTDInvoice).reduce((a, b) => Math.max(a, b)) },
    //     { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.YTDInvoice).reduce((a, b) => Math.max(a, b)) });
    //   filterData.map(a => {
    //     // this.saleDetail.push({ name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) }, { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });
    //     this.saleInvoiceCount = filterData.map(a => a.TodayInvoice).reduce(function (a, b) { return a + b; });
    //     this.saleMenu = [
    //       { name: 'Gross Amount', value: filterData.map(a => a.TodayGrossAmount).reduce((a, b) => { return a + b; }) },
    //       { name: 'Discount', value: filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; }) },
    //       { name: 'Expense', value: filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; }) },
    //       { name: 'Tax', value: filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; }) },
    //       { name: 'Voids', value: filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; }) },
    //     ];
    //   })

    //   this.saleInvoiceCount = this.saleDetail[1].value / this.saleDetail[1].count;

    // } else {
    //   this.totalSales = [{ name: 'Total Sales', value: '0' }];
    //   this.saleInvoiceCount = 0;
    //   this.saleDetail.push(
    //     { name: 'Target', value: 0 },
    //     { name: 'MTD', value: 0 },
    //     { name: 'YTD', value: 0 });

    //   this.saleMenu = [
    //     { name: 'Gross Amount', value: '0' },
    //     { name: 'Discount', value: '0' },
    //     { name: 'Expense', value: '0' },
    //     { name: 'Tax', value: '0' },
    //     { name: 'Voids', value: '0' },
    //   ];
    // }
  }



  getSaleMOPDetails(data: any, startDate: any, endDate: any) {
    this.paymentMode = [];
    this.paymentModeDetails = [];
    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
        return a + b;
      });
      this.paymentMode = [{ name: 'Payment Mode', value: sum }];
      const summary = new Map<string, number>();
      filterData.forEach(transaction => {
        const { MOPName, TodayAmt } = transaction;
        const currentSum = summary.get(MOPName) || 0;
        summary.set(MOPName, currentSum + TodayAmt);
      });
      let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
      _orderDetails.map(x => {
        let _count = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
        let _amt = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
        let _contr = (_amt / sum) * 100;

        this.paymentModeDetails.push({ name: x.name, contribution: parseFloat(_contr.toFixed(3)), value: x.value, orders: parseFloat(_contr.toFixed(0)) })
      });
      this.paymentModeDetails = this.paymentModeDetails.sort((a, b) => b.value - a.value)
      // console.log(this.paymentModeDetails);
    } else {
      this.paymentMode = [{ name: 'Payment Mode', value: '0' }];
      this.paymentModeDetails = [];
    }

    this.mopCardOptions.dataTable = this.paymentModeDetails;
    let _footer_variable = this.paymentModeDetails.length > 0 ? this.paymentModeDetails[0]?.name : ''
    this.mopCardOptions.footerText = "Preferred Mode : " + _footer_variable;
  }

  getItemSalesDetails(data: any) {
    this.topSales = [];
    this.topSalesDetails = [];
    let _totalOrders = JSON.parse(data);
    let sum: number = 0
    if (_totalOrders.length > 0) {
      sum = _totalOrders.map(a => a.SaleValue).reduce(function (a, b) { return a + b; });
    }


    const result = new Map<string, number>();
    _totalOrders.forEach(transaction => {
      const { SubGroupName, SaleValue } = transaction;
      result.set(SubGroupName, (result.get(SubGroupName) || 0) + SaleValue);
    });
    let _groupData = Array.from(result, ([name, value]) => ({ name, value }));
    _groupData = _groupData.sort((a, b) => b.value - a.value);
    // console.log(_groupData);

    // console.log(_groupData.slice(0, 5));
    // this.topSales = _groupData.slice(0, 5);
    _groupData.slice(0, 5).map(r => {
      let _contr = ((r.value / sum) * 100).toFixed(2);
      this.topSales.push({ name: r.name, orders: _contr, value: r.value })
    });

    if (sum > 0) {
      this.topCategoryAvg = ((_groupData[0].value / sum) * 100);
    }


    this.topSales.map(r => {
      const filteredArray = _totalOrders.filter(obj => obj.SubGroupName >= r.name);
      filteredArray.sort((a, b) => b.Quantity - a.Quantity);
      let filterItems = filteredArray.slice(0, 5);
      filterItems.map(x => {
        this.topSalesDetails.push({ group: r.name, name: x.ProductName, quantity: x.Quantity, value: x.SaleValue });
      });
    });

    this.topSaleCardOptions.dataTable = this.topSalesDetails;
    this.topSaleCardOptions.footerText = 'Top Contribution ' + this.topCategoryAvg.toFixed(2) + '%'
    this.topSaleCardOptions.groupData = this.topSales;


  }

  getTaxAndDiscounts(data: any) {
    this.taxAndDisc = [];
    this.taxAndDiscDetails = [];
    let discData = JSON.parse(data[4]);
    let taxData = JSON.parse(data[5]);

    const summary = new Map<string, number>();
    discData.forEach(transaction => {
      const { SaleMode, Disc } = transaction;
      const currentSum = summary.get(SaleMode) || 0;
      summary.set(SaleMode, currentSum + Disc);
    });
    let _discountDetails = Array.from(summary, ([name, value]) => ({ name, value }));
    if (_discountDetails.length > 0) {
      _discountDetails.map(r => {
        if (r.value > 0) {
          this.taxAndDiscDetails.push({ group: 'Discount', name: r.name, value: parseFloat(r.value.toFixed(3)) });
        }
      });
    }

    taxData.forEach(transaction => {
      const { Tax, TaxAmount } = transaction;
      const currentSum = summary.get(Tax) || 0;
      summary.set(Tax, currentSum + TaxAmount);
    });
    let _taxDetails = Array.from(summary, ([name, value]) => ({ name, value }));
    if (_taxDetails.length > 0) {
      _taxDetails.map(r => {
        if (r.value > 0) {
          this.taxAndDiscDetails.push({ group: 'Tax', name: r.name, value: parseFloat(r.value.toFixed(3)) });
        }
      });
    }
    if (discData.length > 0) {
      this.taxAndDisc.push({ name: 'Discount', value: discData.map(a => a.Disc).reduce((a, b) => { return a + b; }) });
      this.totalDicCount = discData.map(a => a.BillCount).reduce(function (a, b) {
        return a + b;
      });
    }
    if (taxData.length > 0) {
      this.taxAndDisc.push({ name: 'Tax', value: taxData.map(a => a.TaxAmount).reduce((a, b) => { return a + b; }) })
    }


    this.taxDiscountCardOptions.groupData = this.taxAndDisc;
    this.taxDiscountCardOptions.dataTable = this.taxAndDiscDetails;
    this.taxDiscountCardOptions.footerText = "Discointed Invoice:" + this.totalDicCount

    // discData.map(r => {
    //   if (r.Disc > 0) {
    //     this.taxAndDiscDetails.push({ group: 'Discount', name: r.SaleMode, value: r.Disc });
    //   }
    // });
    // taxData.map(r => {
    //   if (r.TaxAmount > 0) {
    //     this.taxAndDiscDetails.push({ group: 'Tax', name: r.Tax, value: r.TaxAmount });
    //   }
    // });
  }

  getFeedBackDetails(data: any, startDate: any, endDate: any) {
    this.feedbackDetails = [];
    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    this.feedbackCount = filterData.length;
    if (filterData.length > 0) {
      const countMap = new Map<string, number>();
      const result: any[] = [];
      filterData.forEach((item) => {
        const key = item['Average'];
        const existingCount = countMap.get(key);
        countMap.set(key, existingCount ? existingCount + 1 : 1);
      });
      let _groupData = Array.from(countMap, ([name, value]) => ({ name, value }));
      _groupData.sort((a, b) => parseInt(b.name) - parseInt(a.name));
      _groupData.map(r => {
        if (r.value > 0) {
          result.push({ name: r.name + ' ★', value: r.value });
        }
      })
      this.feedbackDetails = result;
    }
  }

  getCustomerDetails(data: any) {
    this.customerData = [];
    this.customerCount = 0;
    let _customerTotal = JSON.parse(data[0]);
    let _newCustomer = JSON.parse(data[1]);
    let _activeCustomer = JSON.parse(data[2]);
    let _loyalCustomer = JSON.parse(data[3]);
    let _inActiveCustomer = JSON.parse(data[4]);
    let _inOperativeCustomer = JSON.parse(data[5]);
    if (_customerTotal.length > 0) {
      this.customerCount = _customerTotal[0].TotalCustomer;
    }
    this.customerData.push({ name: 'New', count: _newCustomer[0].NewCustomer });
    this.customerData.push({ name: 'Active', count: _activeCustomer[0].ActiveCustomer });
    this.customerData.push({ name: 'Loyal', count: _loyalCustomer[0].LoyalCustomer });
    this.customerData.push({ name: 'In-Active', count: _inActiveCustomer[0].InActive });
    this.customerData.push({ name: 'In-Operative', count: _inOperativeCustomer[0].InOperative });

    this.customerCardOption.dataTable = this.customerData;
    this.customerCardOption.footerText = "Total Customers : " + this.customerCount;

  }

  

  ngOnInit(): void {
    const [startDate, endDate] = analyticsPanelItems[0].value.split('/');
    this.selectedDateRange = {startDate:startDate,endDate:endDate};


    // this.service.currentDate.subscribe(r=> {console.log(r)});
    // this.service.currentDate.subscribe(r=> {console.log(r)});
    // this.loadData(startDate, endDate);
    // this.loadData1(startDate, endDate);
  }


  onlocationChanged(counter: any) {
    this.service.selectedLocation = counter;
    localStorage.setItem('loc', counter)
    // this.service.setLocation(counter);
    if (counter > 0) {
      this.router.navigate(['/analytics-sales-report']);
    } else {
      this.router.navigate(['/analytics-dashboard']);
    }
  }

  refreshPage() {
    this.loadData1(this.service.selectedDates[0], this.service.selectedDates[1]);
  }


  onLocationMenuClck(e: any) {
    console.log(e.itemData.id);
    if (e.itemData.id == 1) {
      this.saleChart = [];
      this.service.getAllLocationSales(this.service.selectedDates[0], this.service.selectedDates[1]).subscribe((result: any) => {
        this.allLocationSale = JSON.parse(result.ExecuteMobiDataResult);
        this.allLocationSale.map((r: any) => {
          this.saleChart.push({ name: r.LocationName, value: r.NetSales });
        });
      });
    }

  }

  onOrderMenuClick(e: any) {
    this.service.getSaleByServiceType(e[0], e[1], 0).subscribe((result: any) => {
      this.getOrderDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    })
  }

  onMOPMenuClick(e: any) {
    this.service.getSaleByMOP(e[0], e[1], 0).subscribe((result: any) => {
      this.getSaleMOPDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    });
  }

  onTaxDiscMenuClick(e: any) {
    this.service.getTaxAndDisount(e[0], e[1]).subscribe((result: any) => {
      this.getTaxAndDiscounts(result.ExecuteMobiDataResult);
    });
  }

  onSaleMenuClick(e: any) {
    this.service.getTotalSales(e[0], e[1], 0).subscribe((result: any) => {
      this.getSaleDetails(result.ExecuteMobiDataResult, e[0], e[1])
    });
  }

  onPurchaseMenuClick(e: any) {
    this.service.getPurchase(e[0], e[1], 0).subscribe((result: any) => {
      this.getPurchaseDetails(JSON.parse(result.ExecuteMobiDataResult[0])[2], e[0], e[1]);
      this.purchaseReturn = JSON.parse(result.ExecuteMobiDataResult[0])[3];
      this.purchaseCardOptions.footerText = "Return:" + this.purchaseReturn?.TodayMemo + "| Amount: " + this.purchaseReturn?.TodayAmt;
    });
  }

  onTopSaleMenuClick(e: any) {
    this.service.getSaleByItem(e[0], e[1], 0).subscribe((result: any) => {
      this.getItemSalesDetails(result.ExecuteMobiDataResult[0]);
    }, error => {
      notify(error.error + ', Please Try Again', 'error', 2000);
    });
  }

  onFeedbackMenuClick(e: any) {
    this.service.getFeedback(e[0], e[1], 0).subscribe((result: any) => {
      this.getFeedBackDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    }, error => {
      notify(error.error + ', Please Try Again', 'error', 2000);
    });
  }

  onCustomerMenuClick(e: any) {
    this.service.getCustomes(e[0], e[1], 0).subscribe((result: any) => {
      this.getCustomerDetails(result.ExecuteMobiDataResult);
    })
  }

  // --==--==--==--==--//

  onSaleByTimeMenuClick(e: any) {

  }

  onCashBankMenuClick(e: any) {

  }

  onRatioMenuClick(e: any) {

  }

  onSaleByTicketMenuClick(e: any) {

  }

  onSaleDepartmentMenuClick(e: any) {

  }

  onSaleByGroupMenuClick(e: any) {

  }

  onSaleBySubGroupMenuClick(e: any) {

  }


  onSaleByBrandMenuClick(e: any) {

  }

  onSaleAreaMenuClick(e: any) {

  }

  onWeekdayMenuClick(e: any) {

  }

  onSupplierMenuClick(e: any) {

  }

  onShiftMenuClick(e: any) {

  }


}

@NgModule({
  imports: [
    DxScrollViewModule,
    DxDataGridModule,
    DxBulletModule,
    DxFunnelModule,
    DxPieChartModule,
    DxChartModule,
    CardAnalyticsModule,
    ToolbarAnalyticsModule,
    DxLoadPanelModule,
    ApplyPipeModule,
    // ConversionCardModule,
    RevenueAnalysisCardModule,
    // RevenueCardModule,
    // RevenueSnapshotCardModule,
    // OpportunitiesTickerModule,
    // RevenueTotalTickerModule,
    // ConversionTickerModule,
    // LeadsTickerModule,
    CommonModule,
    TotalSaleTickerModule,
    TotalPurchaseTickerModule,
    NetSaleTickerModule,
    NumberOfOrdersTickerModule,
    MopTickerModule,
    CashCollectionTickerModule,
    OnlineSaleTickerModule,
    TaxesTickerModule,
    TopSaleTickerModule,
    FeedbackTickerModule,
    CustomerTickerModule,
    SalesByRangeCardModule,

    SaleCardModule,
    SaleByTimeCardModule,
    SaleGraphCardModule,
    FraudCotrolCardlistModule
  ],
  providers: [],
  exports: [],
  declarations: [AnalyticsDashboardComponent],
})
export class AnalyticsDashboardModule { }



    //sale by Service Type /Orders
    // const calculateSum = (arr: any[], prop1: string, prop2: string, value: any) => {
    //   return arr.filter(item => item[prop1] === value).reduce((acc, curr) => acc + curr[prop2], 0);
    // };
    // const getDistinctValues = (arr: any[], prop: string) => {
    //   return Array.from(new Set(arr.map(item => item[prop])));
    // };

    // this.typeOrders = [{ name: 'Dine-In', value: 100 }, { name: 'Delivery', value: 300 }, { name: 'Takeaway', value: 500 }, { name: 'Online', value: 1500 }];
    // this.mopDetails = [{ name: 'Cash', value: 1500 }, { name: 'Credit Card', value: 300 }, { name: 'Phonepe', value: 500 }];
    // this.onlineOrders = [{ name: 'HD', value: 100 }, { name: 'Swiggy', value: 300 }, { name: 'Zomato', value: 500 }, { name: 'Urban Piper', value: 500 }];

    // this.saleDetail = [{ name: 'MTD', value: 100 }, { name: 'YTD', value: 100 }];
    // this.taxDetail = [{ name: 'SGST', value: 100 }, { name: 'CGST', value: 100 }];
    // this.discountDetail = [{ name: 'Bill', value: 100 }, { name: 'Scheme', value: 100 }, { name: 'External', value: 100 }];

    // this.topSalesDetails = [{ name: 'Grocery', value: 100 }, { name: 'Stationary', value: 100 }, { name: 'Fruits', value: 100 }]



    // //Sale By Location / MOP
    // this.service.getSaleByLocation().subscribe((r: any) => {
    //   let _totalSales = JSON.parse(r.ExecuteMobiDataResult[0]);
    //   let mopName = JSON.parse(r.ExecuteMobiDataResult[1]);
    //   let sum: number = _totalSales.map(a => a.NetAmount).reduce(function (a, b) {
    //     return a + b;
    //   });
    //   this.paymentMode = [{ name: 'Total Sales', value: sum }];

    //   console.log(_totalSales);


    //   mopName.map(a => {
    //     _totalSales.map(r => {
    //       let isExist = r.hasOwnProperty(a.MOPName.replace(/ /g, ''));
    //       if (isExist) {
    //         this.paymentModeDetails.push({ name: a.MOPName, value: (r[a.MOPName.replace(/ /g, '')]) });
    //         // console.log(a.MOPName.replace(/ /g, ''));
    //         // console.log(r);
    //       }

    //       // let isExist = mopName.some(function (el) { return r.hasOwnProperty(el.MOPName) });
    //       // console.log(isExist);
    //     });

    //   });

    //   // _totalSales.map(a => {
    //   //   console.log(a);
    //   //   console.log(mopName);

    //   //   // if (a.hasOwnProperty('Cash')) {

    //   //   // }

    //   //   let isExist = mopName.some(function (el) { return a.hasOwnProperty(el.MOPName) }); //mopName.some(function (el) { return el.MOPName === a[el.MOPName] });

    //   //   console.log(isExist);

    //   //   // this.paymentModeDetails.push({ name: 'Total Sales', value: sum });
    //   // });


    // })




    // const tasks: Observable<object>[] = [
    //   ['opportunities', this.service.getOpportunitiesByCategory],
    //   ['sales', this.service.getSales],
    //   ['salesByCategory', this.service.getSalesByCategory],
    //   ['salesByState', (startDate: string, endDate: string) => this.service.getSalesByStateAndCity(startDate, endDate).pipe(
    //     map((data) => this.service.getSalesByState(data))
    //   )
    //   ]
    // ].map(([dataName, loader]: [string, DataLoader]) => {
    //   const loaderObservable = loader(startDate, endDate).pipe(share());

    //   loaderObservable.subscribe((result: DashboardData) => {
    //     this[dataName] = result;
    //   });

    //   return loaderObservable;
    // });

    // forkJoin(tasks).subscribe(() => {
    //   this.isLoading = false;
    // });



      // loadData = (startDate: string, endDate: string) => {
  //   this.isLoading = true;
  //   this.purchaseDetail = [{ name: 'MTD', value: 100 }, { name: 'YTD', value: 100 }];

  //   this.saleAnalysisData = [
  //     { outlet: 'Root', orders: 10, sales: 2000, purchase: 1000, tax: 150, discount: 20, charges: 30.5, onlineorder: 40, percentage: 0.1 },
  //     { outlet: 'Head Office', orders: 5, sales: 463, purchase: 0, tax: 56, discount: 20, charges: 56, onlineorder: 0, percentage: 0.3 },
  //     { outlet: 'Mumbai', orders: 34, sales: 5970, purchase: 1800, tax: 454, discount: 150, charges: 0, onlineorder: 60, percentage: 0.6 }
  //   ];

  //   // Location Grid Data for grid
  //   this.service.getAllLocationSales(startDate, endDate).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult));
  //     this.allLocationSale = JSON.parse(r.ExecuteMobiDataResult);
  //     this.allLocationSale.map((r: any) => {
  //       this.saleChart.push({ name: r.LocationName, value: r.NetSales });
  //     });

  //   });

  //   // Order Card / Sales by Type
  //   this.service.getSaleByServiceType(endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]));
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[1]));

  //     let _targetValue = JSON.parse(r.ExecuteMobiDataResult[1]);
  //     if (_targetValue.length > 0) {
  //       this.targetValue = _targetValue.map(a => a.BudgetAmt).reduce((a, b) => Math.max(a, b));
  //     }
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       this.orders = [{ name: 'Orders', value: sum }];
  //       this.orderCount = filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; });
  //       const summary = new Map<string, number>();
  //       // console.log(filterData);
  //       filterData.forEach(transaction => {
  //         const { SaleMode, TodayAmt } = transaction;
  //         const currentSum = summary.get(SaleMode) || 0;
  //         summary.set(SaleMode, currentSum + TodayAmt);
  //       });
  //       let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //       _orderDetails.map(x => {
  //         let _count = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
  //         let _amt = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
  //         let _contr = (_amt / sum) * 100;
  //         this.orderDetails.push({ name: x.name, value: x.value, orders: _count, contribution: parseFloat(_contr.toFixed(2)) })
  //       });

  //     } else {
  //       this.orders = [{ name: 'Orders', value: '0' }];
  //       this.orderCount = 0
  //       this.orderDetails = [];
  //     }

  //   });


  //   // Sale Card
  //   this.service.getTotalSales(endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     // this.saleDetail = [];
  //     this.saleInvoiceCount = 0;
  //     this.totalSales = [];
  //     let _totalSales = JSON.parse(r.ExecuteMobiDataResult);
  //     let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       this.totalSales = [{ name: 'Total Sales', value: sum }];
  //       this.targetPercentage = parseInt(((sum / this.targetValue) * 100).toFixed(0))

  //       this.saleDetail.push(
  //         { name: 'Target', value: this.targetValue },
  //         { name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) },
  //         { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });
  //       filterData.map(a => {
  //         // this.saleDetail.push({ name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) }, { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });
  //         this.saleInvoiceCount = filterData.map(a => a.TodayInvoice).reduce(function (a, b) { return a + b; });
  //         this.saleMenu = [
  //           { name: 'Gross Amount', value: filterData.map(a => a.TodayGrossAmount).reduce((a, b) => { return a + b; }) },
  //           { name: 'Discount', value: filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; }) },
  //           { name: 'Expense', value: filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; }) },
  //           { name: 'Tax', value: filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; }) },
  //           { name: 'Voids', value: filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; }) },
  //         ];
  //       })

  //     } else {
  //       this.totalSales = [{ name: 'Total Sales', value: '0' }];
  //       this.saleInvoiceCount = 0;
  //       this.saleMenu = [
  //         { name: 'Gross Amount', value: '0' },
  //         { name: 'Discount', value: '0' },
  //         { name: 'Expense', value: '0' },
  //         { name: 'Tax', value: '0' },
  //         { name: 'Voids', value: '0' },
  //       ];
  //     }
  //   });


  //   // Payment Mode Card
  //   this.service.getSaleByMOP(startDate, endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]));
  //     this.paymentMode = [];
  //     this.paymentModeDetails = [];
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       this.paymentMode = [{ name: 'Payment Mode', value: sum }];

  //       // this.orderCount=filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; });
  //       const summary = new Map<string, number>();
  //       filterData.forEach(transaction => {
  //         const { MOPName, TodayAmt } = transaction;
  //         const currentSum = summary.get(MOPName) || 0;
  //         summary.set(MOPName, currentSum + TodayAmt);
  //       });

  //       let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //       _orderDetails.map(x => {
  //         let _count = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
  //         let _amt = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
  //         let _contr = (_amt / sum) * 100;
  //         this.paymentModeDetails.push({ name: x.name, value: x.value, orders: _count, contribution: parseFloat(_contr.toFixed(3)) })
  //       });
  //       // this.paymentModeDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //     } else {
  //       this.paymentMode = [{ name: 'Payment Mode', value: '0' }];
  //       this.paymentModeDetails = [];
  //     }
  //   });

  //   // Sale By Category
  //   this.service.getSaleByItem(startDate, endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]));
  //     this.topSales = [];
  //     this.topSalesDetails = [];
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     const result = new Map<string, number>();
  //     _totalOrders.forEach(transaction => {
  //       const { SubGroupName, SaleValue } = transaction;
  //       result.set(SubGroupName, (result.get(SubGroupName) || 0) + SaleValue);
  //     });
  //     let _groupData = Array.from(result, ([name, value]) => ({ name, value }));
  //     _groupData.sort((a, b) => b.value - a.value);
  //     // console.log(_groupData.slice(0, 5));
  //     this.topSales = _groupData.slice(0, 5);

  //     _totalOrders.forEach(r => {
  //       if (this.topSales.some(value => r.SubGroupName.includes(value.name))) {
  //         // let _count = _totalOrders.filter(item => item.ProductName === r.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
  //         // let _amt = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
  //         // let _contr= (_amt/sum )*100;
  //         this.topSalesDetails.push({ group: r.SubGroupName, name: r.ProductName, quantity: r.Quantity, value: r.SaleValue });
  //       }
  //     });

  //   });


  //   // Tax & Discount Card
  //   this.service.getTaxAndDisount(moment(startDate).format('MM/DD/YYYY'), moment(endDate).format('MM/DD/YYYY')).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]));

  //     this.taxAndDisc = [];
  //     this.taxAndDiscDetails = [];
  //     let discData = JSON.parse(r.ExecuteMobiDataResult[4]);
  //     console.log(discData);
  //     if (discData.length > 0) {
  //       this.taxAndDisc.push({ name: 'Discount', value: discData.map(a => a.Disc).reduce((a, b) => { return a + b; }) })
  //     }
  //     let taxData = JSON.parse(r.ExecuteMobiDataResult[5]);
  //     if (taxData.length > 0) {
  //       this.taxAndDisc.push({ name: 'Tax', value: taxData.map(a => a.TaxAmount).reduce((a, b) => { return a + b; }) })
  //     }
  //     discData.map(r => {
  //       if (r.Disc > 0) {
  //         this.taxAndDiscDetails.push({ group: 'Discount', name: r.SaleMode, value: r.Disc });
  //       }
  //     });
  //     taxData.map(r => {
  //       if (r.TaxAmount > 0) {
  //         this.taxAndDiscDetails.push({ group: 'Tax', name: r.Tax, value: r.TaxAmount });
  //       }
  //     });
  //   });



  //   // FeedBack
  //   this.service.getFeedback(startDate, endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     this.feedbackDetails = [];
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     // console.log(_totalOrders);

  //     let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     this.feedbackCount = filterData.length;
  //     if (filterData.length > 0) {
  //       const countMap = new Map<string, number>();
  //       const result: any[] = [];
  //       filterData.forEach((item) => {
  //         const key = item['Average'];
  //         const existingCount = countMap.get(key);
  //         countMap.set(key, existingCount ? existingCount + 1 : 1);
  //       });

  //       let _groupData = Array.from(countMap, ([name, value]) => ({ name, value }));
  //       _groupData.sort((a, b) => parseInt(b.name) - parseInt(a.name));
  //       // console.log(_groupData);
  //       _groupData.map(r => {
  //         if (r.value > 0) {
  //           result.push({ name: r.name + ' ★', value: r.value });
  //         }
  //       })
  //       this.feedbackDetails = result;
  //     }
  //   });


  //   // Customers
  //   this.service.getCustomes(startDate, endDate, this.service.selectedLocation).subscribe((r: any) => {
  //     this.customerData = [];
  //     this.customerCount = 0;
  //     let _customerTotal = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     let _newCustomer = JSON.parse(r.ExecuteMobiDataResult[1]);
  //     let _activeCustomer = JSON.parse(r.ExecuteMobiDataResult[2]);
  //     let _loyalCustomer = JSON.parse(r.ExecuteMobiDataResult[3]);
  //     let _inActiveCustomer = JSON.parse(r.ExecuteMobiDataResult[4]);
  //     let _inOperativeCustomer = JSON.parse(r.ExecuteMobiDataResult[5]);
  //     if (_customerTotal.length > 0) {
  //       this.customerCount = _customerTotal[0].TotalCustomer;
  //     }
  //     this.customerData.push({ name: 'New Customer', value: _newCustomer[0].NewCustomer });
  //     this.customerData.push({ name: 'Active Customer', value: _activeCustomer[0].ActiveCustomer });
  //     this.customerData.push({ name: 'Loyal Customer', value: _loyalCustomer[0].LoyalCustomer });
  //     this.customerData.push({ name: 'In Active', value: _inActiveCustomer[0].InActive });
  //     this.customerData.push({ name: 'In Operative', value: _inOperativeCustomer[0].InOperative });
  //   });

  //   this.isLoading = false;

  // };

