import { Component, EventEmitter, Input, NgModule, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { DataService } from 'src/app/services';
import { cashBankOptions, customerOptions, feedbackOptions, mopOptions, ordersOptions, purchaseOptions, ratioAnalysisOptions, saleOptions, shiftCardOptions, supplierCardOptions, taxDiscountOptions, topSaleOptions } from 'src/app/types/cardoptions';
import { analyticsPanelItems, DynamicCardOptions } from 'src/app/types/resource';
import { CardDynamicModule } from '../../library/card-dynamic/card-dynamic.component';

// type DataLoader = (startDate: string, endDate: string, location: number) => Observable<any>;

@Component({
  selector: 'sale-card',
  templateUrl: './sale-card.component.html',
  styles: [`
    .blinking-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      background-color: #000;
      border-radius: 50%;
      animation: blink 1s infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .loading-container {
      display: flex;
      align-items: center;
    }

    .loading-container span {
      margin-left: 10px;
    }
  `]
})


export class SaleCardComponent implements OnInit, OnChanges {

  @Input() cardOptions: DynamicCardOptions;
  @Output() cardDateRange = new EventEmitter();

  @Input() cardID: any;
  @Input() dates: any;



  cardDateRangeClick(e: any) {
    // console.log(e);
    // console.log(this);
    // this.cardDateRange.emit(e);
    let startDate; let endDate;
    if (e[0]) { startDate = moment(e[0]).format("YYYY-MM-DD"); }
    if (e[1]) { endDate = moment(e[1]).format("YYYY-MM-DD"); }
    this.loadCardData(startDate, endDate, this.service.selectedLocation)
  }

  constructor(private service: DataService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      let dateChanges = changes['dates'].currentValue;
      this.loadCardData(dateChanges.startDate, dateChanges.endDate, this.service.selectedLocation);
    }
  }

  ngOnInit(): void {
    // console.log(this.dates);
    // const [startDate, endDate] = this.dates; //analyticsPanelItems[0].value.split('/');
    this.loadCardData(this.dates.startDate, this.dates.endDate, this.service.selectedLocation);
  }

  loadCardData(startDate, endDate, locationID) {
    this.cardOptions.isLoading = true;
    switch (this.cardID) {
      case 1: // sale
        // console.log(this.cardOptions);
        this.service.getTotalSales(startDate, endDate, locationID).subscribe((result: any) => {
          // console.log(result);
          //result.ExecuteMobiDataResult[0],
          this.getSaleDetails(result.ExecuteMobiDataResult[0], startDate, endDate)
        });

        break;
      case 2: // purchase
        this.service.getPurchase(startDate, endDate, locationID).subscribe((result: any) => {
          this.getPurchaseDetails(JSON.parse(result.ExecuteMobiDataResult[0])[2], startDate, endDate);
          let purchaseReturn = JSON.parse(result.ExecuteMobiDataResult[0])[3];
          if (purchaseReturn) {
            this.cardOptions.footerText = "Return:" + purchaseReturn?.TodayMemo + "| Amount: " + purchaseReturn?.TodayAmt;
          } else {
            this.cardOptions.footerText = "Return: 0 | Amount: 0";
          }
          this.cardOptions.isLoading = false;

        })
        break;
      case 3: // Orders
        this.service.getSaleByServiceType(startDate, endDate, locationID).subscribe((result: any) => {
          this.getOrderDetails(result.ExecuteMobiDataResult[0], startDate, endDate)
        });
        break;
      case 4: // MOP
        this.service.getSaleByMOP(startDate, endDate, locationID).subscribe((result: any) => {
          this.getSaleMOPDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
        });
        break;
      case 5: // Tax and Discount
        this.service.getTaxAndDisount(startDate, endDate).subscribe((result: any) => {
          this.getTaxAndDiscounts(result.ExecuteMobiDataResult);
        })
        break;
      case 6: // Top Sale
        this.service.getSaleByItem(startDate, endDate, locationID).subscribe((result: any) => {
          this.getItemSalesDetails(result.ExecuteMobiDataResult[0]);
        });
        break;
      case 7: // Feedback
        this.service.getFeedback(startDate, endDate, locationID).subscribe((result: any) => {
          this.getFeedBackDetails(result.ExecuteMobiDataResult[0], startDate, endDate);
        });
        break;
      case 8: // Customer
        this.service.getCustomes(startDate, endDate, locationID).subscribe((result: any) => {
          this.getCustomerDetails(result.ExecuteMobiDataResult);
        });
        break;
      case 9: // All Location Sale

        break;
      case 10: // Location Sales Graph

        break;
      case 11: // cash and bank
        this.service.getCashAndBank(startDate, endDate, locationID).subscribe((result: any) => {
          if(result.ExecuteMobiDataResult.length>0){
            this.getCashAndBankDetails(result.ExecuteMobiDataResult, startDate, endDate);
          }
        });
        break;

      case 12: // ratio analysis
        this.service.getRatioAnalysis(startDate, endDate, locationID).subscribe((result: any) => {
          this.getRatioAnalysis(result.ExecuteMobiDataResult[0]);
        });
        break;

      case 23: // supplier perfomance
        this.service.getSupplierStatement(startDate, endDate, locationID).subscribe((result: any) => {
          this.getSupplierStatement(startDate, endDate, result.ExecuteMobiDataResult);
        });
        break;

      case 24://sale by shift
        this.service.getSalesByShift(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
          this.getSalesByShift(result.ExecuteMobiDataResult[0]);
        });
        break;
    }
  }


  // Sale -1
  getSaleDetails(data: any, startDate: any, endDate: any) {
    this.cardOptions = saleOptions;
    let saleInvoiceCount = 0;
    let totalSales = [];
    let saleDetail = [];
    let saleMenu = [];
    let targetPercentage = 0;
    let targetValue = 0;
    let _totalSales = JSON.parse(data);
    let filterData = _totalSales.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayNetAmount).reduce(function (a, b) {
        return a + b;
      });

      totalSales = [{ name: 'Total Sales', value: sum }];
      targetPercentage = targetValue == 0 ? 100 : parseInt(((sum / targetValue) * 100).toFixed(0))
      let _todays = _totalSales.filter(r => moment(r.VchDate).format('DD/MM/YYYY') == moment(new Date()).format('DD/MM/YYYY'));
      //filterData.map(a => a.TodayInvoice).reduce((a, b) => Math.max(a, b))
      //filterData.map(a => a.TodayBillAmount).reduce((a, b) => Math.max(a, b))
      saleDetail.push(
        { name: 'Today', count: _todays.length > 0 ? _todays[0].TodayInvoice : 0, value: _todays.length > 0 ? _todays[0].TodayBillAmount : 0 },
        { name: 'MTD', count: filterData.map(a => a.MTDInvoice).reduce((a, b) => Math.max(a, b)), value: filterData.map(a => a.MTDNetAmount).reduce((a, b) => Math.max(a, b)) },
        { name: 'YTD', count: filterData.map(a => a.YTDInvoice).reduce((a, b) => Math.max(a, b)), value: filterData.map(a => a.YTDNetAmount).reduce((a, b) => Math.max(a, b)) });
      filterData.map(a => {
        saleInvoiceCount = filterData.map(a => a.TodayInvoice).reduce(function (a, b) { return a + b; });
        let _todayTotal = filterData.map(a => a.TodayBillAmount).reduce((a, b) => Math.max(a, b));
        let _discount = filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; });
        let _expense = filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; });
        let _tax = filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; });
        let _void = filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; });
        let _gross = _todayTotal + _discount - _expense - _tax - _void;

        saleMenu = [
          { name: 'Gross Amount', value: _todays.length > 0 ? _todays[0].TodayGrossAmount : 0 },
          { name: 'Discount', value: _todays.length > 0 ? _todays[0].TodayDiscount : 0 },
          { name: 'Expense', value: _todays.length > 0 ? _todays[0].TodayExpenses : 0 },
          { name: 'Tax', value: _todays.length > 0 ? _todays[0].TodayTax : 0 },
          { name: 'Voids', value: _todays.length > 0 ? _todays[0].TodayVoidAmount : 0 },
        ];

        // saleMenu = [
        //   { name: 'Gross Amount', value: _gross },
        //   { name: 'Discount', value: filterData.map(a => a.TodayDiscount).reduce((a, b) => { return a + b; }) },
        //   { name: 'Expense', value: filterData.map(a => a.TodayExpenses).reduce((a, b) => { return a + b; }) },
        //   { name: 'Tax', value: filterData.map(a => a.TodayTax).reduce((a, b) => { return a + b; }) },
        //   { name: 'Voids', value: filterData.map(a => a.TodayVoidAmount).reduce((a, b) => { return a + b; }) },
        // ];
      })
      saleInvoiceCount = saleDetail[0].value / saleDetail[0].count;

    } else {
      totalSales = [{ name: 'Total Sales', value: '0' }];
      saleInvoiceCount = 0;
      saleDetail.push(
        { name: 'Today', value: 0 },
        { name: 'MTD', value: 0 },
        { name: 'YTD', value: 0 });
      saleMenu = [
        { name: 'Gross Amount', value: '0' },
        { name: 'Discount', value: '0' },
        { name: 'Expense', value: '0' },
        { name: 'Tax', value: '0' },
        { name: 'Voids', value: '0' },
      ];
    }
    this.cardOptions.dataTable = saleDetail;
    this.cardOptions.dropDownMenu = saleMenu;
    this.cardOptions.percentageVal = targetPercentage;
    this.cardOptions.subHeader = [{ key: 'Target', val: targetValue }, { key: 'Achievement', val: saleDetail[0].value }]
    this.cardOptions.footerText = 'Average Ticket Size : ' + this.service.customInrFormat(saleInvoiceCount);
    this.cardOptions.isLoading = false;

  }

  // Purchase -2
  getPurchaseDetails(data: any, startDate: any, endDate: any) {
    this.cardOptions = purchaseOptions;
    let totalPurchase = [];
    let purchaseDetail = [];
    let _totalPurchase = data;
    if (_totalPurchase) {
      totalPurchase = [{ name: 'Total Purchase', value: _totalPurchase.TodayAmt }];
      purchaseDetail.push(
        { name: 'Today', count: _totalPurchase.TodayMemo, value: _totalPurchase.TodayAmt },
        { name: 'MTD', count: _totalPurchase.MTDMemo, value: _totalPurchase.MTDAmt },
        { name: 'YTD', count: _totalPurchase.YTDMemo, value: _totalPurchase.YTDAmt });
    } else {
      totalPurchase = [{ name: 'Total Purchase', value: 0 }];
      purchaseDetail.push(
        { name: 'Today', count: 0, value: 0 },
        { name: 'MTD', count: 0, value: 0 },
        { name: 'YTD', count: 0, value: 0 });
    }
    this.cardOptions.dataTable = purchaseDetail;
  }

  // Order -3
  getOrderDetails(data: any, startDate: any, endDate: any) {
    this.cardOptions = ordersOptions;
    let orderDetails = [];
    let orders = [];
    let orderCount = 0;

    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
        return a + b;
      });
      orders = [{ name: 'Orders', value: filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; }) }];
      orderCount = filterData.map(a => a.TodayBill).reduce(function (a, b) { return a + b; });//sum;//
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
        orderDetails.push({ name: x.name, orders: _count, value: x.value, ticket: parseFloat(_tickets), contribution: parseFloat(_contr.toFixed(2)) })
        orderDetails = orderDetails.sort((a, b) => b.value - a.value)
      });

    } else {
      orders = [{ name: 'Orders', value: '0' }];
      orderCount = 0
      orderDetails = [];
    }

    this.cardOptions.dataTable = orderDetails;
    this.cardOptions.countVal = orderCount;
    let _footer = orderDetails.length > 0 ? orderDetails[0].name : '';
    this.cardOptions.footerText = "Highest Order : " + _footer;
    this.cardOptions.isLoading = false;
  }

  // MOP -4
  getSaleMOPDetails(data: any, startDate: any, endDate: any) {
    this.cardOptions = mopOptions;
    let paymentMode = [];
    let paymentModeDetails = [];
    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    if (filterData.length > 0) {
      let sum: number = filterData.map(a => a.TodayAmt).reduce(function (a, b) {
        return a + b;
      });
      paymentMode = [{ name: 'Payment Mode', value: sum }];
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

        paymentModeDetails.push({ name: x.name, contribution: parseFloat(_contr.toFixed(3)), value: x.value, orders: parseFloat(_contr.toFixed(0)) })
      });
      paymentModeDetails = paymentModeDetails.sort((a, b) => b.value - a.value)
      // console.log(this.paymentModeDetails);
    } else {
      paymentMode = [{ name: 'Payment Mode', value: '0' }];
      paymentModeDetails = [];
    }

    this.cardOptions.dataTable = paymentModeDetails;
    let _footer_variable = paymentModeDetails.length > 0 ? paymentModeDetails[0]?.name : ''
    this.cardOptions.footerText = "Preferred Mode : " + _footer_variable;
    this.cardOptions.isLoading = false;
  }

  // Tax and Discount -5
  getTaxAndDiscounts(data: any) {
    this.cardOptions = taxDiscountOptions;
    let taxAndDisc = [];
    let taxAndDiscDetails = [];
    let totalDicCount = 0;
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
          taxAndDiscDetails.push({ group: 'Discount', name: r.name, value: parseFloat(r.value.toFixed(3)) });
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
          taxAndDiscDetails.push({ group: 'Tax', name: r.name, value: parseFloat(r.value.toFixed(3)) });
        }
      });
    }
    if (discData.length > 0) {
      taxAndDisc.push({ name: 'Discount', value: discData.map(a => a.Disc).reduce((a, b) => { return a + b; }) });
      totalDicCount = discData.map(a => a.BillCount).reduce(function (a, b) {
        return a + b;
      });
    }
    if (taxData.length > 0) {
      taxAndDisc.push({ name: 'Tax', value: taxData.map(a => a.TaxAmount).reduce((a, b) => { return a + b; }) })
    }
    this.cardOptions.groupData = taxAndDisc;
    this.cardOptions.dataTable = taxAndDiscDetails;
    this.cardOptions.footerText = "Discointed Invoice:" + totalDicCount
    this.cardOptions.isLoading = false;
  }

  //Top Sale -6
  getItemSalesDetails(data: any) {
    this.cardOptions = topSaleOptions;
    let topSales = [];
    let topSalesDetails = [];
    let _totalOrders = JSON.parse(data);
    let sum: number = 0
    let topCategoryAvg = 0;
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
    _groupData.slice(0, 5).map(r => {
      let _contr = ((r.value / sum) * 100).toFixed(2);
      topSales.push({ name: r.name, orders: _contr, value: r.value })
    });

    if (sum > 0) {
      topCategoryAvg = ((_groupData[0].value / sum) * 100);
    }

    topSales.map(r => {
      const filteredArray = _totalOrders.filter(obj => obj.SubGroupName >= r.name);
      filteredArray.sort((a, b) => b.Quantity - a.Quantity);
      let filterItems = filteredArray.slice(0, 5);
      filterItems.map(x => {
        topSalesDetails.push({ group: r.name, name: x.ProductName, quantity: x.Quantity, value: x.SaleValue });
      });
    });

    this.cardOptions.dataTable = topSalesDetails;
    this.cardOptions.footerText = 'Top Contribution ' + topCategoryAvg.toFixed(2) + '%'
    this.cardOptions.groupData = topSales;
    this.cardOptions.isLoading = false;

  }

  //Feedback -7
  getFeedBackDetails(data: any, startDate: any, endDate: any) {
    this.cardOptions = feedbackOptions;
    let feedbackDetails = [];
    let _totalOrders = JSON.parse(data);
    let filterData = _totalOrders.filter(r => this.service.formatDate(new Date(r.VchDate)) >= this.service.formatDate(new Date(startDate)) && this.service.formatDate(new Date(r.VchDate)) <= this.service.formatDate(new Date(endDate)));
    let feedbackCount = filterData.length;
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
          result.push({ name: r.name + ' ★', value: r.value.toFixed(2) });
        }
      })
      feedbackDetails = result;
      this.cardOptions.dataTable = result;
    }
    this.cardOptions.isLoading = false;
  }

  // Customers -8
  getCustomerDetails(data: any) {
    this.cardOptions = customerOptions;
    let customerData = [];
    let customerCount = 0;
    let _customerTotal = JSON.parse(data[0]);
    let _newCustomer = JSON.parse(data[1]);
    let _activeCustomer = JSON.parse(data[2]);
    let _loyalCustomer = JSON.parse(data[3]);
    let _inActiveCustomer = JSON.parse(data[4]);
    let _inOperativeCustomer = JSON.parse(data[5]);
    if (_customerTotal.length > 0) {
      customerCount = _customerTotal[0].TotalCustomer;
    }
    customerData.push({ name: 'New', count: _newCustomer[0].NewCustomer });
    customerData.push({ name: 'Active', count: _activeCustomer[0].ActiveCustomer });
    customerData.push({ name: 'Loyal', count: _loyalCustomer[0].LoyalCustomer });
    customerData.push({ name: 'In-Active', count: _inActiveCustomer[0].InActive });
    customerData.push({ name: 'In-Operative', count: _inOperativeCustomer[0].InOperative });

    this.cardOptions.dataTable = customerData;
    this.cardOptions.footerText = "Total Customers : " + customerCount;
    this.cardOptions.isLoading = false;

  }

  // Cash and Bank -11
  getCashAndBankDetails(data: any, s, e) {
    this.cardOptions = cashBankOptions;
    let cashBankDetails = [];
    let cashBank = [];
    let _data = JSON.parse(data);
    _data.map((r: any) => {
      cashBankDetails.push({ name: r.Account, value: r.Closing });
    });

    let cashBankTotal = _data.length > 0 ? _data.map(a => a.Closing).reduce(function (a, b) { return a + b; }) : 0;
    cashBank = [{ name: 'Cash-Bank', value: cashBankTotal }];


    this.service.getCashExpense(s, e, this.service.selectedLocation).subscribe((r: any) => {
      let cashExpense = JSON.parse(r.ExecuteMobiDataResult[0])[0].Amount;
      if (cashExpense > 0) {
        this.cardOptions.footerText = 'Runway: ' + cashBankTotal / cashExpense;
      } else {
        this.cardOptions.footerText = 'Runway: 0';
      }
    });
    this.cardOptions.showSumOnTop=true;
    this.cardOptions.dataTable = cashBankDetails;
    this.cardOptions.isLoading = false;
  }

  // Ratio analysis-12
  getRatioAnalysis(data: any) {
    this.cardOptions = ratioAnalysisOptions;
    let ratioAnalysis = [];
    let _data = JSON.parse(data);
    let filterData = _data.filter(r => r.Heading == 'Principal Groups');
    filterData.map((r: any) => {
      ratioAnalysis.push({ name: r.Particulars, value: parseFloat(r.Value) });
    });

    this.cardOptions.showSumOnTop=true;
    this.cardOptions.dataTable = ratioAnalysis;
    this.cardOptions.isLoading = false;
    this.cardOptions.footerText = "More ➜  ";

  }

  // Supplier Perfomance -23
  getSupplierStatement(startDate, endDate, data: any) {
    this.cardOptions = supplierCardOptions;
    let supplierDetails = [];
    let supplierData = [];
    let _data = JSON.parse(data);
    _data.map((r: any) => {
      supplierDetails.push({ name: r.AccountName, value: r.TotalPurchase, due: r.DueAmount });
    });
    supplierData = [{ name: 'Suppliers', value: _data.length > 0 ? _data.map(a => a.TotalPurchase).reduce(function (a, b) { return a + b; }) : 0 }];
    this.cardOptions.dataTable = supplierDetails;
    this.service.getPurchase(startDate, endDate, this.service.selectedLocation).subscribe((result: any) => {
      let transData = JSON.parse(result.ExecuteMobiDataResult[0]);
      if (transData.length > 0) {
        let purchaseReturn = transData.filter(x => x.TransactionType == 'Purchase Return');
        if (purchaseReturn.length > 0) {
          let retunrCount = purchaseReturn[0]?.TodayMemo ? purchaseReturn[0]?.TodayMemo : 0;
          let returnValue = purchaseReturn[0]?.TodayAmt ? purchaseReturn[0]?.TodayAmt : 0;

          this.cardOptions.footerText = "Return: # " + retunrCount + " | Amount: " + returnValue;
        } else {
          this.cardOptions.footerText = "Return: # 0  | Amount: 0";
        }
      } else {
        this.cardOptions.footerText = "Return: # 0  | Amount: 0";
      }
    });

    // this.cardOptions.footerText='More ➜ ';
    this.cardOptions.isLoading = false;
  }

  // sale By Shift -24 
  getSalesByShift(data: any) {
    this.cardOptions = shiftCardOptions;
    let saleshift = [];
    let saleshiftDetails = [];
    if (data) {
      let _totalOrders = JSON.parse(data);
      let filterData = _totalOrders;
      if (filterData.length > 0) {
        saleshift = [{ name: 'Shift Sale', value: filterData.map(a => a.Total).reduce(function (a, b) { return a + b; }) }];
        let bfAmt = filterData.map(a => a.BreakFastAmount).reduce(function (a, b) { return a + b; });
        let dnrAmt = filterData.map(a => a.DinnerAmount).reduce(function (a, b) { return a + b; });
        let lncAmt = filterData.map(a => a.LunchAmount).reduce(function (a, b) { return a + b; });
        let snkAmt = filterData.map(a => a.SnacksAmount).reduce(function (a, b) { return a + b; });
        let sum = bfAmt + dnrAmt + lncAmt + snkAmt;
        saleshiftDetails.push({ name: 'Breakfast', value: bfAmt.toFixed(2), orders: ((bfAmt / sum) * 100).toFixed(2) });
        saleshiftDetails.push({ name: 'Lunch', value: lncAmt.toFixed(2), orders: ((lncAmt / sum) * 100).toFixed(2) });
        saleshiftDetails.push({ name: 'Snacks', value: snkAmt.toFixed(2), orders: ((snkAmt / sum) * 100).toFixed(2) });
        saleshiftDetails.push({ name: 'Dinner', value: dnrAmt.toFixed(2), orders: ((dnrAmt / sum) * 100).toFixed(2) });

      } else {
        saleshift = [{ name: 'Shift Sale', value: '0' }];
        saleshiftDetails = [];
      }
    }

    this.cardOptions.dataTable = saleshiftDetails;
    this.cardOptions.isLoading = false;

  }


}

@NgModule({
  imports: [
    CardDynamicModule
  ],
  declarations: [SaleCardComponent],
  exports: [SaleCardComponent],
})
export class SaleCardModule { }