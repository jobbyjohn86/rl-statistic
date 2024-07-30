import {
  Component, OnInit, NgModule, ChangeDetectorRef,
} from '@angular/core';
import { CommonModule, CurrencyPipe, formatDate } from '@angular/common';

import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxRangeSelectorModule } from 'devextreme-angular/ui/range-selector';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { DxDropDownButtonTypes } from 'devextreme-angular/ui/drop-down-button';

import { DataService } from 'src/app/services';
import { CardAnalyticsModule } from 'src/app/components/library/card-analytics/card-analytics.component';
import { ToolbarAnalyticsModule } from 'src/app/components/utils/toolbar-analytics/toolbar-analytics.component';
import { SalesByRangeCardModule } from 'src/app/components/utils/sales-by-range-card/sales-by-range-card.component';
import { SalesPerformanceCardModule } from 'src/app/components/utils/sales-performance-card/sales-performance-card.component';
import { SalesRangeCardModule } from 'src/app/components/utils/sales-range-card/sales-range-card.component';
import { analyticsPanelItems, ChartOptions, Dates, DynamicCardOptions, preLayoutLocation } from 'src/app/types/resource';
import { ApplyPipeModule } from 'src/app/pipes/apply.pipe';
import { CustomerTickerModule, MopTickerModule, NumberOfOrdersTickerModule, RevenueAnalysisCardModule, SaleGraphCardModule, TaxesTickerModule, TotalSaleTickerModule } from 'src/app/components';
import { SaleTypeAnalysisCardModule } from 'src/app/components/utils/sale-type-analysis-card/sale-type-analysis-card.component';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { TotalPurchaseTickerModule } from 'src/app/components/utils/total-purchase-ticker/total-purchase-ticker.component';
import { ChartCardModule } from 'src/app/components/library/chart-card/chart-card.component';
import { SaleByTimeCardModule } from 'src/app/components/utils/sales-by-time-card/sales-by-time-card.component';
import { CashBankTickerModule } from 'src/app/components/utils/cash-bank-ticker/cash-bank-ticker.component';
import { SupplierStatementTickerModule } from 'src/app/components/utils/supplier-statement-ticker/supplier-statement-ticker.component';
import { RatioAnalysisTickerModule } from 'src/app/components/utils/ratio-analysis-ticker/ratio-analysis-ticker.component';
import { SaleByShiftTickerModule } from 'src/app/components/utils/sale-by-shift-ticker/sale-by-shift-ticker.component';
import notify from 'devextreme/ui/notify';
import { feedackGraphCardOption, saleByBrandOptions, saleByCustAreaOption, saleByDepartmentOptions, saleByGroupOptions, saleBySubGroupOptions, saleByTicketOptions, saleByTimeOptions, saleWeekDayGraphCardOption } from 'src/app/types/chartoptions';
import { SaleCardModule } from 'src/app/components/utils/sale-card/sale-card.component';
import { cashBankOptions, customerOptions, feedbackOptions, mopOptions, ordersOptions, purchaseOptions, ratioAnalysisOptions, saleOptions, shiftCardOptions, supplierCardOptions, taxDiscountOptions, topSaleOptions } from 'src/app/types/cardoptions';
import { FraudCotrolCardlistModule } from 'src/app/components/utils/fraud-cotrol-cardlist/fraud-cotrol-cardlist.component';

type DataLoader = (startDate: string, endDate: string, location: number) => Observable<any>;

@Component({
  templateUrl: './analytics-sales-report.component.html',
  styleUrls: ['./analytics-sales-report.component.scss']
})
export class AnalyticsSalesReportComponent implements OnInit {
  analyticsPanelItems = analyticsPanelItems;

  visualRange: unknown = {};

  isLoading: boolean = false;

  fraudControlData: any = [
    { name: 'Modified Invoices', value: 0, count: 0 },
    { name: 'Void Invoices', value: 0, count: 0 },
    { name: 'Discounted Invoices', value: 0, count: 0 },
    { name: 'Reprinted Invoices', value: 0, count: 0 },
    { name: 'Open KOT', value: 0, count: 0 },
    { name: 'Void KOT', value: 0, count: 0 },
    { name: 'Re-Printed KOT', value: 0, count: 0 },
    { name: 'NC KOT', value: 0, count: 0 }
  ];

  selectedLocation: number = 0;
  selectedLocationName: string = 'Sale';


  saleByTicket: any;
  salesByService: any;
  saleByTime: any;
  saleByDepartment: any;
  profitNdLoss: any;
  expenses: any;
  income: any;
  totalSales: any;
  saleInvoiceCount: number = 0;
  saleDetail: any = []
  targetPercentage: number = 0;
  targetValue: number = 0;
  saleMenu: any = [];
  purchaseReturn: any = [];

  paymentMode: any = [];
  paymentModeDetails: any = [];
  payModeColumns: any[] = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'value', caption: 'Amount(₹)' },
    { dataField: 'contribution', caption: 'Contribution(%)' }
  ];
  paymodeCardColumn: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: '', caption: '' },
    { dataField: 'orders', caption: 'Contr%' },
    { dataField: 'value', caption: 'Amount' }
  ];

  feedback: any;
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

  saleByTimeOptions: ChartOptions = saleByTimeOptions;
  saleByTicketOptions: ChartOptions = saleByTicketOptions;
  saleByDepartmentOptions: ChartOptions = saleByDepartmentOptions;
  saleByGroupOptions: ChartOptions = saleByGroupOptions;
  saleBySubGroupOptions: ChartOptions = saleBySubGroupOptions;
  saleByBrandOptions: ChartOptions = saleByBrandOptions;
  saleByCustAreaOption: ChartOptions = saleByCustAreaOption;
  feedackGraphCardOption: ChartOptions = feedackGraphCardOption;
  saleWeekDayGraphCardOption: ChartOptions = saleWeekDayGraphCardOption;


  //

  // saleGraphCardOption = {
  //   title: 'Sales',
  //   palette: 'Ocean',
  //   argumentField: 'DepartmentName',
  //   valueField: 'Today',
  //   dataSource: []
  // }


  // saleByCustAreaOption = {
  //   title: 'Customer by Demographics',
  //   palette: 'Carmine',
  //   argumentField: 'Area',
  //   valueField: 'Count',
  //   dataSource: [],
  //   footer: 'Most Customers From:',
  //   class: 'bar',
  //   isRotated: true,
  //   isLegentVisible: false,
  //   valueName: 'Area'
  // }

  // feedackGraphCardOption = {
  //   title: 'Net Promoters Score',
  //   palette: 'Office',
  //   argumentField: 'name',
  //   valueField: 'value',
  //   dataSource: [
  //     { name: 'Detractors', value: 0, count: 0 },
  //     { name: 'Passives', value: 0, count: 0 },
  //     { name: 'Promoters', value: 0, count: 0 }
  //   ],
  //   footer: '',
  //   class: 'bar',
  //   isRotated: false,
  //   isLegentVisible: false,
  //   valueName: 'NPS'
  // };

  // saleWeekDayGraphCardOption = {
  //   title: 'Sale By Weekday',
  //   palette: 'Office',
  //   argumentField: 'WeekDayName',
  //   valueField: 'value',
  //   dataSource: [],
  //   footer: '',
  //   class: 'chart',
  //   seriesList: [{ valueField: 'ThisWeek', name: 'ThisWeek' }, { valueField: 'LastWeek', name: 'LastWeek' },
  //   { valueField: 'ThisMonth', name: 'ThisMonth' }, { valueField: 'LastMonth', name: 'LastMonth' }
  //   ]
  // }



  orders: any = [];
  orderDetails: any = [];
  orderCount: any = '0';
  orderCardColumn: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'order', caption: 'Orders#' },
    { dataField: 'value', caption: 'Amount' },
    { dataField: 'ticket', caption: 'Ticket' }
  ];
  orderColumns: any[] = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'orders', caption: 'Orders#' },
    { dataField: 'value', caption: 'Amount(₹)' },
    { dataField: 'contribution', caption: 'Contribution(%)' },
    { dataField: 'ticket', caption: 'Ticket' }
  ];


  cashBank: any = [];
  cashBankCardColumn: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: '', caption: '' },
    { dataField: '', caption: '' },
    { dataField: 'value', caption: 'Amount(₹)' }
  ];
  cashBankDetails: any = [];
  // cashBankSum: number = 0;

  // supplierCardColumn:any=[
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: '', caption: '' },
  //   { dataField: 'orders', caption: 'Contr%' },
  //   { dataField: 'value', caption: 'Amount' }
  // ]

  runningTable: any = {};

  saleByGroup: any;
  saleBySubGroup: any;
  saleByBrand: any;

  supplierDetails: any = [];
  supplierData: any = [];
  supplierColumns: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'value', caption: 'Amount' },
    { dataField: 'count', caption: 'Due' },
  ]

  ratioAnalysis: any = [];
  ratioAnalysisColumns: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'value', caption: 'Amount' }
  ]

  taxAndDisc: any = [];
  taxAndDiscDetails: any = [];
  totalDicCount: number = 0;
  // discount & Tax
  discTaxColumns: any[] = [
    { dataField: 'group', caption: 'Group', groupIndex: 0 },
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'value', caption: 'Amount(₹)' }
  ]
  taxdiscountCardColumns: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: '', caption: '' },
    { dataField: '', caption: '' },
    { dataField: 'value', caption: 'Amount' }
  ];


  saleshift: any = [];
  saleshiftDetails: any = [];
  saleshiftCardColumn: any = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: '', caption: '' },
    { dataField: 'orders', caption: 'Contr(%)' },
    { dataField: 'value', caption: 'Amount' }
  ];
  saleshiftColumns: any[] = [
    { dataField: 'name', caption: 'Particular' },
    { dataField: 'orders', caption: 'Contribution' },
    { dataField: 'value', caption: 'Amount' }
  ];

  layout: any = [];
  selectedDateRange: any = [];
  multiLocationData: any = [];
  

  constructor(private service: DataService, private router: Router, private currencyPipe: CurrencyPipe, private cdr:ChangeDetectorRef) {
    let existLayout = localStorage.getItem('canvas');
    if (existLayout != null) {
      if (JSON.parse(existLayout).filter(r => r.default == true && r.canvasId == 2) &&  JSON.parse(existLayout).filter(r => r.default == true && r.canvasId == 2).length>0){
        this.layout = JSON.parse(existLayout).filter(r => r.default == true && r.canvasId == 2)[0].value;
      } else {
        this.layout = preLayoutLocation;
      }
    }else {
      this.layout = preLayoutLocation;
    }

    // this.getCashAndBankDetails = this.getCashAndBankDetails.bind(this);
  }

  onRangeChanged = ({ value: dates }) => {
    const [startDate, endDate] = dates.map((date) => formatDate(date, 'YYYY-MM-dd', 'en'));
    this.isLoading = true;
  };

  selectionChange({ item: period }: DxDropDownButtonTypes.SelectionChangedEvent) {
    this.isLoading = true;
  }

  customizeSaleText(arg: { percentText: string }) {
    return arg.percentText;
  }

  customInrFormat(value) {
    return this.service.customInrFormat(value);
  };



  ngOnInit(): void {
    if (this.service.selectedLocation == 0) {
      let _loc = localStorage.getItem('loc')
      if (_loc) {
        this.service.selectedLocation = parseInt(_loc);
      } else {
        this.router.navigate(['/analytics-dashboard']);
      }
    }
    const [startDate, endDate] = analyticsPanelItems[0].value.split('/');
    this.selectedDateRange = {startDate:startDate,endDate:endDate};
    // this.loadData(startDate, endDate);
  }

  selectionDateChange(dates: Dates) {
    // console.log('selected')
    // this.loadData(dates.startDate, dates.endDate);
    this.selectedDateRange = dates;
    this.cdr.detectChanges();
  }


  onlocationChanged(counter: number) {
    this.selectedLocation = counter;
  }

  loadData = (startDate: string, endDate: string) => {
    this.isLoading = true;
    const tasks: Observable<any>[] = [
      ['getTotalSales', (s: string, e: string, num: number) => this.service.getTotalSales(s,e, this.service.selectedLocation)],
      ['getSaleByTicket', (s: string, e: string, num: number) => this.service.getSaleByTicket(s, e, this.service.selectedLocation)],
      ['getSaleByServiceType', (s: string, e: string, num: number) => this.service.getSaleByServiceType(s,e, this.service.selectedLocation)],
      ['getSaleByTime', (s: string, e: string, num: number) => this.service.getSaleByTime(s, e, this.service.selectedLocation)],
      ['getSaleByDepartment', (s: string, e: string, num: number) => this.service.getSaleByDepartment(s, e, this.service.selectedLocation)],
      ['getProfitAndLoss', (s: string, e: string, num: number) => this.service.getProfitAndLoss(s, e, this.service.selectedLocation)],
      ['getFraudControl', (s: string, e: string, num: number) => this.service.getFraudControl(s, e, this.service.selectedLocation)],
      ['getFeedback', (s: string, e: string, num: number) => this.service.getFeedback(s, e, this.service.selectedLocation)],
      ['getCashAndBank', (s: string, e: string, num: number) => this.service.getCashAndBank(s, e, this.service.selectedLocation)],
      ['getSaleByDemographicArea', (s: string, e: string, num: number) => this.service.getSaleByDemographicArea(s, e, this.service.selectedLocation)],
      ['getSaleByGroup', (s: string, e: string, num: number) => this.service.getSaleByGroup(s, e, this.service.selectedLocation)],
      ['getSaleBySubGroup', (s: string, e: string, num: number) => this.service.getSaleBySubGroup(s, e, this.service.selectedLocation)],
      ['getSaleByBrand', (s: string, e: string, num: number) => this.service.getSaleByBrand(s, e, this.service.selectedLocation)],
      ['getSupplierStatement', (s: string, e: string, num: number) => this.service.getSupplierStatement(s, e, this.service.selectedLocation)],
      ['getRatioAnalysis', (s: string, e: string, num: number) => this.service.getRatioAnalysis(s, e, this.service.selectedLocation)],
      ['getSaleByWeekEnd', (s: string, e: string, num: number) => this.service.getSaleByWeekEnd(s, e, this.service.selectedLocation)],
      ['getSaleByMOP', (s: string, e: string, num: number) => this.service.getSaleByMOP(s, e, this.service.selectedLocation)],
      ['getTaxAndDisount', (s: string, e: string, num: number) => this.service.getTaxAndDisount(s, e)],
      ['getSalesByShift', (s: string, e: string, num: number) => this.service.getSalesByShift(s, e, this.service.selectedLocation)],
      ['getPurchase', (s: string, e: string, num: number) => this.service.getPurchase(s, e, this.service.selectedLocation)],
      // ['getCashExpense', (s: string, e: string, num: number) => this.service.getCashExpense(s, e, this.service.selectedLocation)]
    ].map(([dataName, loader]: [string, DataLoader]) => {
      const loaderObservable = loader(startDate, endDate, 0).pipe(share());
      loaderObservable.subscribe((result: any) => {
        // this[dataName] = result;
        switch (dataName) {
          case 'getSaleByTicket':
            this.getSaleByTicket(result.ExecuteMobiDataResult)
            break;
          case 'getSaleByServiceType':
            this.getOrderDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
            break;
          case 'getSaleByTime':
            if(result.ExecuteMobiDataResult[0]){
              this.saleByTime = JSON.parse(result.ExecuteMobiDataResult[0]);
              this.saleByTimeOptions.dataSource = this.saleByTime;
            }
            break;
          case 'getSaleByDepartment':
            this.saleByDepartmentOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
            break;
          case 'getProfitAndLoss':
            this.getExpenseAndIncome(result.ExecuteMobiDataResult[0]);
            break;
          case 'getTotalSales':
            this.getSaleDetails(result.ExecuteMobiDataResult, startDate, endDate)
            break;
          case 'getFraudControl':
            this.getFraudControl(result.ExecuteMobiDataResult);
            break;
          case 'getFeedback':
            this.getFeedBackDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
            break;
          case 'getCashAndBank':
            this.getCashAndBankDetails(result.ExecuteMobiDataResult, startDate, endDate);
            break;
          case 'getSaleByDemographicArea':
            this.getSaleByDemographicArea(result.ExecuteMobiDataResult);
            break;
          case 'getSaleByGroup':
            this.saleByGroup = JSON.parse(result.ExecuteMobiDataResult);
            this.saleByGroupOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult)//.filter(x=> x.TodayPercent>2);
            break;
          case 'getSaleBySubGroup':
            this.saleBySubGroupOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
            break;
          case 'getSaleByBrand':
            this.saleByBrand = JSON.parse(result.ExecuteMobiDataResult);
            this.saleByBrandOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
            break;
          case 'getSupplierStatement':
            this.getSupplierStatement(result.ExecuteMobiDataResult);
            break;
          case 'getRatioAnalysis':
            this.getRatioAnalysis(result.ExecuteMobiDataResult[0]);
            break;

          case 'getSaleByWeekEnd':
            this.saleWeekDayGraphCardOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
            break;
          case 'getSaleByMOP':
            this.getSaleMOPDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
            break;
          case 'getTaxAndDisount':
            this.getTaxAndDiscounts(result.ExecuteMobiDataResult);
            break;
          case 'getSalesByShift':
            this.getSalesByShift(result.ExecuteMobiDataResult[0]);
            break;
          case 'getPurchase':
            this.purchaseReturn = JSON.parse(result.ExecuteMobiDataResult[0])[3];
            break;
          // case 'getCashExpense':
          //   console.log(result);
          //   break;
        }

      }, error => {
        if (error.error.includes('There was a socket error at the endpoint API/execute-mobi-data.')) {
          notify('Oops! We’re having trouble connecting to the server.\n  Please Try Again', 'error', 2000);
        } else {
          notify(error.error + ', Please Try Again', 'error', 2000);
        }

      });
      return loaderObservable;
    });


    forkJoin(tasks).subscribe(() => {
      this.isLoading = false;
    }, error => this.isLoading = false);

  }

  refreshPage() {
    this.loadData(this.service.selectedDates[0], this.service.selectedDates[1]);
  }


  getSaleByTicket(data: any) {
    let _data = JSON.parse(data);
    let ticketData: any = [];
    let d1 = _data.filter((r: any) => r.BillAmount <= 250 && r.BillAmount >= 1);
    ticketData.push({ name: '1 to 250', value: d1.length });
    d1 = _data.filter((r: any) => r.BillAmount <= 500 && r.BillAmount >= 251);
    ticketData.push({ name: '251 to 500', value: d1.length });
    d1 = _data.filter((r: any) => r.BillAmount <= 750 && r.BillAmount >= 501);
    ticketData.push({ name: '501 to 750', value: d1.length });
    d1 = _data.filter((r: any) => r.BillAmount <= 999 && r.BillAmount >= 751);
    ticketData.push({ name: '751 to 999', value: d1.length });
    d1 = _data.filter((r: any) => r.BillAmount >= 1000);
    ticketData.push({ name: '1000 & Above', value: d1.length });
    // this.saleByTicket = ticketData;
    this.saleByTicketOptions.dataSource = ticketData;
  }

  getExpenseAndIncome(data: any) {
    let _data = JSON.parse(data);
    let expenseData: any = [];
    let d1 = _data.filter((r: any) => r.GroupTypeID == 0);
    if (d1.length > 0) {
      d1.map((r: any) => {
        if (r.GroupName != 'zzzzzNet Profit') {
          expenseData.push({ name: r.MName, value: r.Balance });
        }
      })
    }
    this.expenses = expenseData;

    // income
    let incomdeData: any = [];
    d1 = _data.filter((r: any) => r.GroupTypeID == 1);
    if (d1.length > 0) {
      d1.map((r: any) => {
        if (r.GroupName != 'zzzzzNet Profit') {
          incomdeData.push({ name: r.MName, value: r.Balance });
        }
      })
    }
    this.income = incomdeData;

  }

  getSaleDetails(data: any, startDate: any, endDate: any) {
    this.saleInvoiceCount = 0;
    this.totalSales = [];
    this.saleDetail = [];
    let _totalSales = JSON.parse(data);

    let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
        return a + b;
      });

      let runningTotal = filterData.map(a => a.TodayRunningTablesAmount).reduce(function (a, b) { return a + b; });
      let runningCount = filterData.map(a => a.TodayNoOfRunningTables).reduce(function (a, b) { return a + b; });
      this.runningTable = {
        name: 'Running Table',
        value: runningTotal,
        orders: runningCount,
        contribution: 0,
        ticket: runningTotal / runningCount
      };
      //============

      this.totalSales = [{ name: 'Total Sales', value: sum }];
      this.targetPercentage = this.targetValue == 0 ? 100 : parseInt(((sum / this.targetValue) * 100).toFixed(0))

      console.log(filterData);
      // let _disc = filterData.map(a => a.TodayDiscount).reduce((a, b) => Math.max(a, b));
      // let _exp = filterData.map(a => a.TodayExpenses).reduce((a, b) => Math.max(a, b));


      this.saleDetail.push(
        { name: 'Target', value: this.targetValue },
        { name: 'Today', value: filterData.map(a => a.TodayNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.TodayInvoice).reduce((a, b) => Math.max(a, b)) },
        { name: 'MTD', value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.MTDInvoice).reduce((a, b) => Math.max(a, b)) },
        { name: 'YTD', value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)), count: filterData.map(a => a.YTDInvoice).reduce((a, b) => Math.max(a, b)) });
      filterData.map(a => {
        this.saleInvoiceCount = filterData.map(a => a.TodayInvoice).reduce(function (a, b) { return a + b; });
        this.saleMenu = [
          { name: 'Gross Amount', value: filterData.map(a => a.TodayGrossAmount).reduce((a, b) => { return a + b; }) },
          { name: 'Discount', value: filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; }) },
          { name: 'Expense', value: filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; }) },
          { name: 'Tax', value: filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; }) },
          { name: 'Voids', value: filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; }) },
        ];
      })

      this.saleInvoiceCount = this.saleDetail[1].value / this.saleDetail[1].count;

    } else {
      this.totalSales = [{ name: 'Total Sales', value: '0' }];
      this.saleInvoiceCount = 0;
      this.saleDetail.push(
        { name: 'Target', value: 0 ,count:0},
        { name: 'MTD', value: 0,count:0 },
        { name: 'YTD', value: 0 ,count:0});

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
    // this.saleCardOptions.subHeader= [{ key: 'Target', val: this.targetValue }, { key: 'Achievement', val: this.saleDetail[0].value }]
    // this.saleCardOptions.footerText = 'Average Ticket Size : ' + this.service.customInrFormat(this.saleInvoiceCount);


  }

  getFraudControl(data: any) {
    // console.log('Fraud Control');
    // console.log(data);

    this.fraudControlData = [];

    // Unsettled Invoice
    let _unsettled = JSON.parse(data[5]);
    if (_unsettled.length > 0) {
      this.fraudControlData.push({ name: 'Unsettled Invoices', value: _unsettled.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _unsettled.length });
    } else {
      this.fraudControlData.push({ name: 'Unsettled Invoices', value: 0, count: 0 });
    }

    //Discount
    let _discount = JSON.parse(data[1]);
    if (_discount.length > 0) {
      this.fraudControlData.push({ name: 'Discounted Invoice', value: _discount.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _discount.length });
    } else {
      this.fraudControlData.push({ name: 'Discounted Invoices', value: 0, count: 0 });
    }

     //Reprint
     let _reprint = JSON.parse(data[2]);
     if (_reprint.length > 0) {
       this.fraudControlData.push({ name: 'Reprinted Invoices', value: _reprint.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _reprint.length });
     } else {
       this.fraudControlData.push({ name: 'Reprinted Invoices', value: 0, count: 0 });
     }
 
      //Cancelled
      let _cancelled = JSON.parse(data[6]);
      if (_cancelled.length > 0) {
        this.fraudControlData.push({ name: 'Cancelled Invoices', value: _cancelled.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _cancelled.length });
      } else {
        this.fraudControlData.push({ name: 'Cancelled Invoices', value: 0, count: 0 });
      }


    // -------------------- KOT -------------------//

    // void KOT
    let _voids = JSON.parse(data[0]);
    if (_voids.length > 0) {
      this.fraudControlData.push({ name: 'Void KOT', value: _voids.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _voids.length });
    } else {
      this.fraudControlData.push({ name: 'Void KOT', value: 0, count: 0 });
    }

    //Open KOT
    let _kot = JSON.parse(data[3]);
    if (_kot.length > 0) {
      this.fraudControlData.push({ name: 'Open KOT', value: _kot.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _kot.length });
    } else {
      this.fraudControlData.push({ name: 'Open KOT', value: 0, count: 0 });
    }

    //Reprinted KOT
    let _reprinted = JSON.parse(data[4]);
    if (_reprinted.length > 0) {
      this.fraudControlData.push({ name: 'Re-Printed KOT', value: _reprinted.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _reprinted.length });
    } else {
      this.fraudControlData.push({ name: 'Re-Printed KOT', value: 0, count: 0 });
    }

    //NC KOT
    let _NCKot = JSON.parse(data[8]);
    if (_NCKot.length > 0) {
      this.fraudControlData.push({ name: 'NC KOT', value: _NCKot.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _NCKot.length });
    } else {
      this.fraudControlData.push({ name: 'NC KOT', value: 0, count: 0 });
    }

  }

  getFeedBackDetails(data: any, startDate: any, endDate: any) {
    this.feedback = [];
    let _totalOrders = JSON.parse(data);
    this.feedackGraphCardOption.footer = 'NPS Score : 0%';
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
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

      let detractors = _groupData.filter(r => r.name == '1');
      let passives = _groupData.filter(r => (r.name == '2' || r.name == '3' || r.name == '4'));
      let promoters = _groupData.filter(r => r.name == '5');
      if (detractors.length > 0) {
        this.feedback.push({ name: 'Detractors', value: (detractors.length / _groupData.length) * 100, count: detractors.length, });
      }
      if (passives.length > 0) {
        this.feedback.push({ name: 'Passives', value: (passives.length / _groupData.length) * 100, count: passives.length, });
      }
      if (promoters.length > 0) {
        this.feedback.push({ name: 'Promoters', value: (promoters.length / _groupData.length) * 100, count: promoters.length, });
      }
      if (this.feedback.length > 0) {
        this.feedackGraphCardOption.dataSource = this.feedback;
      }

      let npsvalue = ((promoters.length / _groupData.length) * 100) - ((detractors.length / _groupData.length) * 100)
      this.feedackGraphCardOption.footer = 'NPS Score : ' + npsvalue;

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
        this.orderDetails.push({ name: x.name, value: this.customInrFormat(x.value), orders: _count, contribution: parseFloat(_contr.toFixed(2)), ticket: _tickets })
        this.orderDetails = this.orderDetails.sort((a, b) => b.value - a.value)
      });

    } else {
      this.orders = [{ name: 'Orders', value: '0' }];
      this.orderCount = 0
      this.orderDetails = [];
    }
  }

  getCashAndBankDetails(data: any, s, e) {
    this.cashBankDetails = [];
    this.cashBank = [];
    let _data = JSON.parse(data);
    _data.map((r: any) => {
      this.cashBankDetails.push({ name: r.Account, value: r.Closing });
    });

    let cashBankTotal  = _data.length > 0 ? _data.map(a => a.Closing).reduce(function (a, b) { return a + b; }) : 0;
    this.cashBank = [{ name: 'Cash-Bank', value: cashBankTotal }];
    


    this.service.getCashExpense(s, e, this.service.selectedLocation).subscribe((r: any) => {
      console.log(JSON.parse(r.ExecuteMobiDataResult[0]));
      let cashExpense =  JSON.parse(r.ExecuteMobiDataResult[0])[0].Amount;
      if (cashExpense>0){
        this.cashBankCardOption.footerText='Runway: ' + cashBankTotal/ cashExpense;
      } else {
        this.cashBankCardOption.footerText='Runway: 0';
      }
      
    });

    

  }

  getSaleByDemographicArea(data: any) {
    let _data = JSON.parse(data[0])

    const summary = new Map<string, number>();
    _data.forEach(transaction => {
      const { Area, Count } = transaction;
      const currentSum = summary.get(Area) || 0;
      summary.set(Area, currentSum + Count);
    });

    let _orderDetails = Array.from(summary, ([Area, Count]) => ({ Area, Count }));
    let topArea = _orderDetails.sort((a, b) => b.Count - a.Count);
    if (topArea.length > 0) {
      this.saleByCustAreaOption.footer = 'Most Customers From: ' + topArea[0].Area;
    } else {
      this.saleByCustAreaOption.footer = '';
    }
    this.saleByCustAreaOption.dataSource = _orderDetails;
  }

  getSupplierStatement(data: any) {
    this.supplierDetails = [];
    this.supplierData = [];
    let _data = JSON.parse(data);
    _data.map((r: any) => {
      this.supplierDetails.push({ name: r.AccountName, value: r.TotalPurchase, count: r.DueAmount });
    });
    this.supplierData = [{ name: 'Suppliers', value: _data.length > 0 ? _data.map(a => a.TotalPurchase).reduce(function (a, b) { return a + b; }) : 0 }];
  }

  getRatioAnalysis(data: any) {
    this.ratioAnalysis = [];
    let _data = JSON.parse(data);
    let filterData = _data.filter(r => r.Heading == 'Principal Groups');
    filterData.map((r: any) => {
      this.ratioAnalysis.push({ name: r.Particulars, value: r.Value });
    });
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

        this.paymentModeDetails.push({ name: x.name, value: x.value, orders: parseFloat(_contr.toFixed(0)), contribution: parseFloat(_contr.toFixed(3)) })
      });
      this.paymentModeDetails = this.paymentModeDetails.sort((a, b) => b.value - a.value)
    } else {
      this.paymentMode = [{ name: 'Payment Mode', value: '0' }];
      this.paymentModeDetails = [];
    }
  }

  getTaxAndDiscounts(data: any) {
    this.taxAndDisc = [];
    this.taxAndDiscDetails = [];
    let discData = JSON.parse(data[4]).filter(r => r.LocationID == this.service.selectedLocation);
    let taxData = JSON.parse(data[5]).filter(r => r.LocationID == this.service.selectedLocation);
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
  }

  getSalesByShift(data: any) {
    this.saleshift = [];
    if (data) {
      let _totalOrders = JSON.parse(data);
      let filterData = _totalOrders;
      if (filterData.length > 0) {
        this.saleshift = [{ name: 'Shift Sale', value: filterData.map(a => a.Total).reduce(function (a, b) { return a + b; }) }];
        let bfAmt = filterData.map(a => a.BreakFastAmount).reduce(function (a, b) { return a + b; });
        let dnrAmt = filterData.map(a => a.DinnerAmount).reduce(function (a, b) { return a + b; });
        let lncAmt = filterData.map(a => a.LunchAmount).reduce(function (a, b) { return a + b; });
        let snkAmt = filterData.map(a => a.SnacksAmount).reduce(function (a, b) { return a + b; });
        let sum = bfAmt + dnrAmt + lncAmt + snkAmt;
        this.saleshiftDetails.push({ name: 'Breakfast', value: bfAmt.toFixed(2), orders: ((bfAmt / sum) * 100).toFixed(2) });
        this.saleshiftDetails.push({ name: 'Lunch', value: lncAmt.toFixed(2), orders: ((lncAmt / sum) * 100).toFixed(2) });
        this.saleshiftDetails.push({ name: 'Snacks', value: snkAmt.toFixed(2), orders: ((snkAmt / sum) * 100).toFixed(2) });
        this.saleshiftDetails.push({ name: 'Dinner', value: dnrAmt.toFixed(2), orders: ((dnrAmt / sum) * 100).toFixed(2) });

      } else {
        this.saleshift = [{ name: 'Shift Sale', value: '0' }];
        this.saleshiftDetails = [];
      }
    }

  }


  onSaleMenuClick(e: any) {
    this.service.getTotalSales(e[0],e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSaleDetails(result.ExecuteMobiDataResult, e[0], e[1])
    });
  }

  onCashBankMenuClick(e: any) {
    this.service.getCashAndBank(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getCashAndBankDetails(result.ExecuteMobiDataResult, e[0], e[1]);
    });
  }

  onOrderMenuClick(e: any) {
    this.service.getSaleByServiceType(e[0],e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getOrderDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    })
  }

  onRatioMenuClick(e: any) {
    this.service.getRatioAnalysis(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getRatioAnalysis(result.ExecuteMobiDataResult[0])
    });
  }

  onSaleByTimeMenuClick(e: any) {
    this.service.getSaleByTime(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleByTime = JSON.parse(result.ExecuteMobiDataResult[0]);
      this.saleByTimeOptions.dataSource = this.saleByTime;
    });
  }

  onSaleByTicketMenuClick(e: any) {
    this.service.getSaleByTicket(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSaleByTicket(result.ExecuteMobiDataResult);
    });
  }

  onSaleDepartmentMenuClick(e: any) {
    this.service.getSaleByDepartment(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleByDepartmentOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
    });
  }

  onSaleByGroupMenuClick(e: any) {
    this.service.getSaleByGroup(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleByGroup = JSON.parse(result.ExecuteMobiDataResult);
      this.saleByGroupOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
    });
  }

  onSaleBySubGroupMenuClick(e: any) {
    this.service.getSaleBySubGroup(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleBySubGroupOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
    })
  }

  onSaleByBrandMenuClick(e: any) {
    this.service.getSaleByBrand(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleByBrand = JSON.parse(result.ExecuteMobiDataResult);
      this.saleByBrandOptions.dataSource = JSON.parse(result.ExecuteMobiDataResult);
    })
  }

  onSaleAreaMenuClick(e: any) {
    this.service.getSaleByDemographicArea(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSaleByDemographicArea(result.ExecuteMobiDataResult);
    })
  }

  onFeedbackMenuClick(e: any) {
    this.service.getFeedback(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getFeedBackDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    })
  }

  onWeekdayMenuClick(e: any) {
    this.service.getSaleByWeekEnd(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.saleWeekDayGraphCardOption.dataSource = JSON.parse(result.ExecuteMobiDataResult);
    })
  }

  onSupplierMenuClick(e: any) {
    this.service.getSupplierStatement(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSupplierStatement(result.ExecuteMobiDataResult);
      this.service.getPurchase(e[0], e[1], this.service.selectedLocation).subscribe((r: any) => {
        this.purchaseReturn = JSON.parse(result.ExecuteMobiDataResult[0])[3];
      });
    })
  }

  onMOPMenuClick(e: any) {
    this.service.getSaleByMOP(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSaleMOPDetails(result.ExecuteMobiDataResult[0], e[0], e[1]);
    });
  }

  onTaxDiscMenuClick(e: any) {
    this.service.getTaxAndDisount(e[0], e[1]).subscribe((result: any) => {
      this.getTaxAndDiscounts(result.ExecuteMobiDataResult);
    });
  }

  onShiftMenuClick(e: any) {
    this.service.getSalesByShift(e[0], e[1], this.service.selectedLocation).subscribe((result: any) => {
      this.getSalesByShift(result.ExecuteMobiDataResult[0]);
    })
  }

  onFraudConrolClick(e:any){
    this.service.getFraudControl(e[0], e[1], this.service.selectedLocation).subscribe((result:any)=>{
      this.getFraudControl(result.ExecuteMobiDataResult);
    });
  }

}

@NgModule({
  imports: [
    DxScrollViewModule,
    DxLoadPanelModule,
    DxButtonModule,
    DxToolbarModule,
    DxPieChartModule,
    DxChartModule,
    DxDropDownButtonModule,
    DxRangeSelectorModule,
    CardAnalyticsModule,
    ToolbarAnalyticsModule,
    ApplyPipeModule,
    CommonModule,
    SalesByRangeCardModule,
    SalesPerformanceCardModule,
    SalesRangeCardModule,
    TotalSaleTickerModule,
    NumberOfOrdersTickerModule,
    SaleTypeAnalysisCardModule,
    MopTickerModule,
    TotalPurchaseTickerModule,
    CustomerTickerModule,
    SaleByTimeCardModule,
    SaleGraphCardModule,
    CashBankTickerModule,
    SupplierStatementTickerModule,
    RatioAnalysisTickerModule,
    TaxesTickerModule,
    SaleByShiftTickerModule,
    SaleCardModule,
    RevenueAnalysisCardModule,
    FraudCotrolCardlistModule
  ],
  exports: [],
  providers: [],
  declarations: [AnalyticsSalesReportComponent],
})
export class AnalyticsSalesReportModule { }



  // loadData = (startDate: string, endDate: string) => {

  //   // Order Info
  //   this.service.getSaleByServiceType(endDate, this.selectedLocation).subscribe((r: any) => {
  //     this.dineIn = [];
  //     this.pickUp = [];
  //     this.delivery = [];
  //     this.dineInCount = 0;
  //     this.pickUpCount = 0;
  //     this.deliveryCount = 0;
  //     this.salesTypeData = [];

  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {

  //       // console.log(filterData);
  //       this.totalSaleValue = filterData.map(a => a.TodayAmt).reduce(function (a, b) { return a + b; });

  //       const summary = new Map<string, number>();
  //       filterData.forEach(transaction => {
  //         const { SaleMode, TodayAmt } = transaction;
  //         const currentSum = summary.get(SaleMode) || 0;
  //         summary.set(SaleMode, currentSum + TodayAmt);
  //       });

  //       //let _contr= (summary.filter(r => r.name == 'Dine In').map(a => a.value).reduce((a, b) => { return a + b; })/ totalAmount)*100;
  //       // let orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //       // this.salesTypeData = orderDetails;



  //       let orderDetails: any = [];
  //       let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //       _orderDetails.map(x => {
  //         let _count = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
  //         let _amt = filterData.filter(item => item.SaleMode === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
  //         let _contr = (_amt / sum) * 100;
  //         orderDetails.push({ name: x.name, value: x.value, orders: _count, contribution: parseFloat(_contr.toFixed(2)) })
  //       });
  //       this.salesTypeData = orderDetails;



  //       if (orderDetails.filter(r => r.name == 'Dine In').length > 0) {
  //         this.dineIn = [{ name: 'Dine In', value: orderDetails.filter(r => r.name == 'Dine In').map(a => a.value).reduce((a, b) => { return a + b; }) }]
  //         this.dineInCount = filterData.filter(r => r.SaleMode == 'Dine In').length;
  //       }
  //       if (orderDetails.filter(r => r.name == 'Pickup').length > 0) {
  //         this.pickUp = [{ name: 'Pickup', value: orderDetails.filter(r => r.name == 'Pickup').map(a => a.value).reduce((a, b) => { return a + b; }) }]
  //         this.pickUpCount = filterData.filter(r => r.SaleMode == 'Pickup').length;
  //       }
  //       if (orderDetails.filter(r => (r.name != 'Pickup' && r.name != 'Dine In')).length > 0) {
  //         this.delivery = [{ name: 'Delivery', value: orderDetails.filter(r => (r.name != 'Pickup' && r.name != 'Dine In')).map(a => a.value).reduce((a, b) => { return a + b; }) }]
  //         this.deliveryCount = filterData.filter(r => (r.SaleMode != 'Pickup' || r.SaleMode != 'Dine In')).length;
  //       }
  //     }

  //     // console.log(this.salesTypeData);

  //   });


  //   // total Sale
  //   this.service.getTotalSales(endDate, this.selectedLocation).subscribe((r: any) => {
  //     this.totalSale = [];
  //     let _totalSales = JSON.parse(r.ExecuteMobiDataResult);
  //     let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       this.totalSale = [{ name: 'Total Sales', value: sum }];
  //     }
  //   });


  //   // Sale By Time
  //   // console.log(startDate + '/' + endDate);

  //   this.service.getSaleByTime(startDate, endDate, this.selectedLocation).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]));
  //     this.timeBySale = JSON.parse(r.ExecuteMobiDataResult[0]);
  //   });


  //   // // Tax and Discount
  //   // this.service.getTaxAndDisount(moment(startDate).format('MM/DD/YYYY'), moment(endDate).format('MM/DD/YYYY')).subscribe((r: any) => {
  //   //   this.discountData = [];
  //   //   this.taxData = [];
  //   //   let discData = JSON.parse(r.ExecuteMobiDataResult[4]);
  //   //   let taxData = JSON.parse(r.ExecuteMobiDataResult[5]);
  //   //   discData = discData.filter(x => x.LocationID == this.selectedLocation);
  //   //   taxData = taxData.filter(x => x.LocationID == this.selectedLocation);

  //   //   console.log(discData);
  //   //   console.log(taxData);

  //   //   // console.log(discData);

  //   //   discData.map(r => {
  //   //     if (r.Disc > 0) {
  //   //       this.discountData.push({ group: 'Discount', name: r.SaleMode, value: r.Disc });
  //   //     }
  //   //   });
  //   //   taxData.map(r => {
  //   //     if (r.TaxAmount > 0) {
  //   //       this.taxData.push({ group: 'Tax', name: r.Tax, value: r.TaxAmount });
  //   //     }
  //   //   });



  //   // });


  //   // Tax & Discount Card
  //   this.service.getTaxAndDisount(moment(startDate).format('MM/DD/YYYY'), moment(endDate).format('MM/DD/YYYY')).subscribe((r: any) => {
  //     this.discountData = [];
  //     this.taxData = [];
  //     let _discData = JSON.parse(r.ExecuteMobiDataResult[4]);
  //     if (_discData.length > 0) {
  //       this.discountData.push({ name: 'Discount', value: _discData.map(a => a.Disc).reduce((a, b) => { return a + b; }) })
  //     }
  //     let _taxData = JSON.parse(r.ExecuteMobiDataResult[5]);
  //     if (_taxData.length > 0) {
  //       this.taxData.push({ name: 'Tax', value: _taxData.map(a => a.TaxAmount).reduce((a, b) => { return a + b; }) })
  //     }

  //     // console.log(this.taxData);
  //     // discData.map(r => {
  //     //   if (r.Disc > 0) {
  //     //     this.taxAndDiscDetails.push({ group: 'Discount', name: r.SaleMode, value: r.Disc });
  //     //   }
  //     // });
  //     // taxData.map(r => {
  //     //   if (r.TaxAmount > 0) {
  //     //     this.taxAndDiscDetails.push({ group: 'Tax', name: r.Tax, value: r.TaxAmount });
  //     //   }
  //     // });
  //   });



  //   //Paymode
  //   this.service.getSaleByMOP(startDate, endDate, this.selectedLocation).subscribe((r: any) => {
  //     this.paymodData = [];
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     // console.log(_totalOrders);

  //     let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
  //     if (filterData.length > 0) {
  //       let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
  //         return a + b;
  //       });
  //       const summary = new Map<string, number>();
  //       filterData.forEach(transaction => {
  //         const { MOPName, TodayAmt } = transaction;
  //         const currentSum = summary.get(MOPName) || 0;
  //         summary.set(MOPName, currentSum + TodayAmt);
  //       });
  //       // this.paymodData = Array.from(summary, ([name, value]) => ({ name, value }));
  //       let _orderDetails = Array.from(summary, ([name, value]) => ({ name, value }));
  //       _orderDetails.map(x => {
  //         let _count = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayBill, 0)
  //         let _amt = filterData.filter(item => item.MOPName === x.name).reduce((acc, curr) => acc + curr.TodayAmt, 0)
  //         let _contr = (_amt / sum) * 100;
  //         this.paymodData.push({ name: x.name, value: x.value, orders: _count, contribution: parseFloat(_contr.toFixed(3)) })
  //       });
  //     }
  //   });


  //   // Top Sale Product
  //   this.service.getSaleByItem(startDate, endDate, this.selectedLocation).subscribe((r: any) => {
  //     let topSales = [];
  //     this.topSalesData = [];
  //     let _totalOrders = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     const result = new Map<string, number>();
  //     _totalOrders.forEach(transaction => {
  //       const { SubGroupName, SaleValue } = transaction;
  //       result.set(SubGroupName, (result.get(SubGroupName) || 0) + SaleValue);
  //     });
  //     let _groupData = Array.from(result, ([name, value]) => ({ name, value }));
  //     _groupData.sort((a, b) => b.value - a.value);
  //     // console.log(_groupData.slice(0, 5));
  //     topSales = _groupData.slice(0, 5);

  //     // console.log(_totalOrders);

  //     _totalOrders.forEach(r => {
  //       if (topSales.some(value => r.SubGroupName.includes(value.name))) {
  //         this.topSalesData.push({ group: r.SubGroupName, name: r.ProductName, value: r.SaleValue, quantity: r.Quantity });
  //       }
  //     });

  //   });


  //   // Fraud Control
  //   this.service.getFraudControl(startDate, endDate, this.selectedLocation).subscribe((r: any) => {
  //     // console.log(JSON.parse(r.ExecuteMobiDataResult[0]))
  //     this.fraudControlData = [];
  //     //Void
  //     let _voids = JSON.parse(r.ExecuteMobiDataResult[0]);
  //     if (_voids.length > 0) {
  //       this.fraudControlData.push({ name: 'Void', value: _voids.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Discount
  //     let _discount = JSON.parse(r.ExecuteMobiDataResult[1]);
  //     if (_discount.length > 0) {
  //       this.fraudControlData.push({ name: 'Discount', value: _discount.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Reprint
  //     let _reprint = JSON.parse(r.ExecuteMobiDataResult[2]);
  //     if (_reprint.length > 0) {
  //       this.fraudControlData.push({ name: 'Reprint', value: _reprint.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Open KOT
  //     let _kot = JSON.parse(r.ExecuteMobiDataResult[3]);
  //     if (_kot.length > 0) {
  //       this.fraudControlData.push({ name: 'Open KOT', value: _kot.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Reprinted KPT
  //     let _reprinted = JSON.parse(r.ExecuteMobiDataResult[4]);
  //     if (_reprinted.length > 0) {
  //       this.fraudControlData.push({ name: 'Re-Printed KOT', value: _reprinted.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Unsettled Inoice
  //     let _unsettle = JSON.parse(r.ExecuteMobiDataResult[5]);
  //     if (_unsettle.length > 0) {
  //       this.fraudControlData.push({ name: 'Unsettled Invoice', value: _unsettle.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Cancelled Inoice
  //     let _canceld = JSON.parse(r.ExecuteMobiDataResult[6]);
  //     if (_canceld.length > 0) {
  //       this.fraudControlData.push({ name: 'Cancelled Invoice', value: _canceld.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }

  //     //Pending Invoice
  //     let _pending = JSON.parse(r.ExecuteMobiDataResult[7]);
  //     if (_pending.length > 0) {
  //       this.fraudControlData.push({ name: 'Pending Invoice', value: _pending.map(a => a.Amount).reduce((a, b) => { return a + b; }) });
  //     }



  //   });


  //   this.isLoading = false;

  //   // const tasks = [
  //   //   ['sales', this.service.getSales('2019-11-01', '2021-12-01')],
  //   //   ['salesByDateAndCategory', this.service.getSalesByOrderDate(groupBy)],
  //   // ].map(([dataName, loader]: [string, Observable<Sale[]>]) => {
  //   //   const task = loader.pipe(share());
  //   //   task.subscribe((data) => this[dataName] = data);
  //   //   return task;
  //   // }
  //   // );

  //   // forkJoin(tasks).subscribe(() => {
  //   //   this.isLoading = false;

  //   //   // console.log(this.groupByPeriods);
  //   //   // console.log(this.salesByDateAndCategory);
  //   // });


  // };



  // sales: any[] = null;
  // salesByCategory: any = null;
  // salesByDateAndCategory: any[] = null;

  // dineIn: any = [];
  // pickUp: any = [];
  // delivery: any = [];
  // dineInCount: number = 0;
  // pickUpCount: number = 0;
  // deliveryCount: number = 0;

  // totalSale: any = [];
  // timeBySale: any = [];

  // salesTypeData: any = [];
  // taxData: any = [];
  // discountData: any = [];
  // paymodData: any = [];
  // topSalesData: any = []


  // orderColumns: any[] = [
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'value', caption: 'Amount(₹)' },
  //   { dataField: 'orders', caption: 'No# Of Orders' },
  //   { dataField: 'contribution', caption: 'Contribution(%)' }
  // ];

  // taxColumns: any[] = [
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'value', caption: 'Amount(₹)' }
  // ];

  // payModeColumns: any[] = [
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'value', caption: 'Amount(₹)' },
  //   { dataField: 'orders', caption: 'Orders#' },
  //   { dataField: 'contribution', caption: 'Contribution(%)' }
  // ]

  // topSaleColumn: any[] = [
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'quantity', caption: 'Quantity' },
  //   { dataField: 'value', caption: 'Amount(₹)' }
  // ]

  // fraudColumns: any[] = [
  //   { dataField: 'name', caption: 'Particular' },
  //   { dataField: 'value', caption: 'Value' }
  // ];


  // groupByPeriods = ['Day', 'Month'];



  // chartOptions={
  //   title:'',
  //   dataSource:[],
  //   chartType:'',
  //   isRotated:true,
  //   palette:'',
  //   valueField:'',
  //   valueName:'',
  //   stack:'',
  //   color:'',
  //   axisTitle:'',
  //   argTitle:'',
  //   argCustomField:'',
  //   argField:'',
  //   type:'',
  // }
  // = {
  //   pallate: 'Violet',
  //   valueField: 'ThisMonth',
  //   name: 'Sales/Hr',
  //   stack: 'ThisMonth',
  //   axisTitle: 'Amount (₹)',
  //   argTitle: 'Time',
  //   argField: 'Hour',
  //   type: 'stackedBar',
  //   argCustomField: 'customizeText',
  //   color: '#F4D03F'
  // }


    // if (counter > 0) {
    //   const [startDate, endDate] = analyticsPanelItems[4].value.split('/');
    //   this.loadData(startDate, endDate);

    //   // this.selectedLocationName =''
    // } else {
    //   this.router.navigate(['/analytics-dashboard']);
    // }


    // //Unsettled Inoice
    // let _unsettle = JSON.parse(data[5]);
    // if (_unsettle.length > 0) {
    //   this.fraudControlData.push({ name: 'Unsettled Invoice', value: _unsettle.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _unsettle.length });
    // } else {
    //   this.fraudControlData.push({ name: 'Unsettles Invoice', value: 0, count: 0 });
    // }

    // //Cancelled Inoice
    // let _canceld = JSON.parse(data[6]);
    // if (_canceld.length > 0) {
    //   this.fraudControlData.push({ name: 'Cancelled Invoice', value: _canceld.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _canceld.length });
    // } else {
    //   this.fraudControlData.push({ name: 'Cancelled Invoices', value: 0, count: 0 });
    // }

    // //Pending Invoice
    // let _pending = JSON.parse(data[7]);
    // if (_pending.length > 0) {
    //   this.fraudControlData.push({ name: 'Pending Invoice', value: _pending.map(a => a.Amount).reduce((a, b) => { return a + b; }), count: _pending.length });
    // } else {
    //   this.fraudControlData.push({ name: 'Pending Invoices', value: 0, count: 0 });
    // }

    // console.log(this.fraudControlData);



