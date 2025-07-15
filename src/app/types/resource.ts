import * as moment from "moment";


export type PanelItem = { text: string, value: string, key: number };

export type Dates = { startDate: string, endDate: string };

const currentDate = moment(new Date()).format('YYYY-MM-DD');
const onebackWeek = moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD');
const twobackWeek = moment(new Date()).subtract(1, 'weeks').format('YYYY-MM-DD');

const now = moment();
const startOfDay = now.format('YYYY-MM-DD');
const startOfYestersay = now.subtract(1, 'day').format('YYYY-MM-DD');
const startOfWeek = now.startOf("week").format('YYYY-MM-DD');
const endOfWeek = now.endOf("week").format('YYYY-MM-DD');
const startOfWeek2 = now.subtract(2, 'week').startOf("week").format('YYYY-MM-DD');
const startOfMnth = now.startOf("month").format('YYYY-MM-DD');
const endOfMnth = now.endOf("month").format('YYYY-MM-DD');
const startOfYear = now.startOf("year").format('YYYY-MM-DD');
const endOfYear = now.endOf("year").format('YYYY-MM-DD');
const fyOfStart = localStorage.getItem('fy') ? JSON.parse(localStorage.getItem('fy')).length > 0 ? moment(JSON.parse(localStorage.getItem('fy'))[0].FinancialYear).format('YYYY-MM-DD') : '2024-04-01' : '';
const fyOfEnd = localStorage.getItem('fy') ? JSON.parse(localStorage.getItem('fy')).length > 0 ? moment(JSON.parse(localStorage.getItem('fy'))[0].FinancialYear).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD') : '2025-03-31' : '';

export const analyticsPanelItems: Array<PanelItem> = [
  {
    text: 'Today',
    value: startOfDay + '/' + startOfDay,
    key: 1,
  },
  {
    text: 'Yesterday',
    value: startOfYestersay + '/' + startOfYestersay,
    key: 7,
  },
  {
    text: 'Week',
    value: startOfWeek + '/' + endOfWeek,
    key: 2,
  }, {
    text: '2 Weeks',
    value: startOfWeek2 + '/' + endOfWeek,
    key: 3,
  }, {
    text: 'Month',
    value: startOfMnth + '/' + endOfMnth,
    key: 4,
  }, {
    text: 'Year',
    value: startOfYear + '/' + endOfYear,
    key: 5,
  }];


export interface ChartOptions {
  id: string,
  title: string,
  dataSource: any,
  chartType: number,
  isRotated: boolean,
  palette: string,
  valueField: string,
  valueName: string,
  stack: string,
  color: string,
  axisTitle: string,
  argTitle: string,
  argCustomField: string,
  argField: string,
  type: string,
  argumentField: string,
  footer: string,
  class: string,
  isLegentVisible: boolean,
  seriesList: any,
  isLoading:any;
}

export interface DynamicCardOptions {
  cardTitle: string;
  showDateRamge: boolean;
  showPercentage: boolean;
  subHeader: Array<KeyVal>;
  dataTable: any;
  showTableHeader: boolean;
  addTopBlankRowOnCard: boolean
  footerText: string;
  groupData: any;
  showSumOnTop: boolean;
  showCountOnTop: boolean;
  isDetailViewVisible: boolean;
  isDropDownVisible: boolean;
  percentageVal: number;
  countVal: number;
  dropDownMenu: any;
  columnLimit: number;
  columnMap: any[];
  gridColumn: any[];
  isLoading:any;
}

export interface ChartOptions {
  id: string;
  title: string;
  dataSource: any;
  chartType: number;
  isRotated: boolean,
  palette: string;
  valueField: string;
  valueName: string;
  stack: string;
  color: string;
  axisTitle: string;
  argTitle: string;
  argCustomField: string;
  argField: string;
  type: string;
}


export interface KeyVal {
  key: string;
  val: number;
}

export const widgetList: any[] = [
  { id: 1, name: 'Sales', color: 'red',method:'getTotalSales' },
  { id: 2, name: 'Purchase', color: 'blue',method:'getPurchase' },
  { id: 3, name: 'Orders', color: 'green' ,method:'getSaleByServiceType'},
  { id: 4, name: 'Payment Mode', color: 'yellow',method:'getSaleByMOP' },
  { id: 5, name: 'Tax & Discount', color: 'purple' ,method:'getTaxAndDisount' },
  { id: 6, name: 'Top Sales', color: 'purple' ,method:'getSaleByItem'},
  { id: 7, name: 'Feedback', color: 'purple' ,method:'getFeedback'},
  { id: 8, name: 'Customer', color: 'purple' ,method:'getCustomes'},
  { id: 9, name: 'Location Insight', color: 'purple' ,method:'getAllLocationSales'},
  { id: 10, name: 'Location Sales', color: 'purple' ,method:'getAllLocationSales'},
  { id: 11, name: 'Cash & Bank', color: 'purple' ,method:'getCashAndBank'},
  { id: 12, name: 'Ratio Analysis', color: 'purple'  ,method:'getRatioAnalysis'},
  { id: 13, name: 'Sale By Time', color: 'purple' ,method:'getSaleByTime'},
  { id: 14, name: 'Sale By Ticket', color: 'purple'  ,method:'getSaleByTicket'},
  { id: 15, name: 'Sale By Department', color: 'purple' ,method:'getSaleByDepartment' },
  { id: 16, name: 'Sale by Group', color: 'purple' ,method:'getSaleByGroup'},
  { id: 17, name: 'Sale By Sub Group', color: 'purple'  ,method:'getSaleBySubGroup'},
  { id: 18, name: 'Sale By Brand', color: 'purple' ,method:'getSaleByBrand'},
  { id: 19, name: 'Fraud Control', color: 'purple'  ,method:'getFraudControl'},
  { id: 20, name: 'Area Demographic', color: 'purple' ,method:'getSaleByDemographicArea'},
  { id: 21, name: 'Net Promoters', color: 'purple' ,method:'getFeedback'},
  { id: 22, name: 'Sale By Weekday', color: 'purple' ,method:'getSaleByWeekEnd'},
  { id: 23, name: 'Supplier Perfomance', color: 'purple' ,method:'getSupplierStatement'},
  { id: 24, name: 'Sale By Shift', color: 'purple' ,method:'getSalesByShift'},
];

export const canvasType: any[] = [
  { id: 1, name: 'All Locaton' },
  { id: 2, name: 'Individual Location' }
]

export const canvasAllLayout: any[] = [
  { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] },
  { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] },
  { columns: [{ items: [] }] },
  { columns: [{ items: [] }] }
];

export const canvasIndivLayout: any[] = [
  { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] },
  { columns: [{ items: [] }, { items: [] }] },
  { columns: [{ items: [] }, { items: [] }] },
  { columns: [{ items: [] }, { items: [] }] },
  { columns: [{ items: [] }] },
  { columns: [{ items: [] }, { items: [] }, { items: [] }] },
  { columns: [{ items: [] }, { items: [] }, { items: [] }, { items: [] }] }
];

export const preLayoutAllLocation: any = [{ "columns": [{ "items": [{ "id": 1, "name": "Sales", "color": "red" }] }, { "items": [{ "id": 2, "name": "Purchase", "color": "blue" }] }, { "items": [{ "id": 3, "name": "Orders", "color": "green" }] }, { "items": [{ "id": 4, "name": "Payment Mode", "color": "yellow" }] }] }, { "columns": [{ "items": [{ "id": 5, "name": "Tax & Discount", "color": "purple" }] }, { "items": [{ "id": 7, "name": "Feedback", "color": "purple" }] }, { "items": [{ "id": 6, "name": "Top Sales", "color": "purple" }] }, { "items": [{ "id": 8, "name": "Customer", "color": "purple" }] }] }, { "columns": [{ "items": [{ "id": 9, "name": "Location Insight", "color": "purple" }] }] }, { "columns": [{ "items": [{ "id": 10, "name": "Location Sales", "color": "purple" }] }] }];

export const preLayoutLocation:any=[
  {
    "columns": [
      {
        "items": [
          {
            "id": 1,
            "name": "Sales",
            "color": "red",
            "method": "getTotalSales"
          }
        ]
      },
      {
        "items": [
          {
            "id": 11,
            "name": "Cash & Bank",
            "color": "purple",
            "method": "getCashAndBank"
          }
        ]
      },
      {
        "items": [
          {
            "id": 3,
            "name": "Orders",
            "color": "green",
            "method": "getSaleByServiceType"
          }
        ]
      },
      {
        "items": [
          {
            "id": 12,
            "name": "Ratio Analysis",
            "color": "purple",
            "method": "getRatioAnalysis"
          }
        ]
      },
      {
        "items": [
          {
            "id": 23,
            "name": "Supplier Perfomance",
            "color": "purple",
            "method": "getSupplierStatement"
          }
        ]
      },
      {
        "items": [
          {
            "id": 4,
            "name": "Payment Mode",
            "color": "yellow",
            "method": "getSaleByMOP"
          }
        ]
      },
      {
        "items": [
          {
            "id": 5,
            "name": "Tax & Discount",
            "color": "purple",
            "method": "getTaxAndDisount"
          }
        ]
      },
      {
        "items": [
          {
            "id": 24,
            "name": "Sale By Shift",
            "color": "purple",
            "method": "getSalesByShift"
          }
        ]
      }
    ]
  },
  {
    "columns": [
      {
        "items": [
          {
            "id": 13,
            "name": "Sale By Time",
            "color": "purple",
            "method": "getSaleByTime"
          }
        ]
      },
      {
        "items": [
          {
            "id": 14,
            "name": "Sale By Ticket",
            "color": "purple",
            "method": "getSaleByTicket"
          }
        ]
      }
    ]
  },
  {
    "columns": [
      {
        "items": [
          {
            "id": 15,
            "name": "Sale By Department",
            "color": "purple",
            "method": "getSaleByDepartment"
          }
        ]
      },
      {
        "items": [
          {
            "id": 16,
            "name": "Sale by Group",
            "color": "purple",
            "method": "getSaleByGroup"
          }
        ]
      }
    ]
  },
  {
    "columns": [
      {
        "items": [
          {
            "id": 17,
            "name": "Sale By Sub Group",
            "color": "purple",
            "method": "getSaleBySubGroup"
          }
        ]
      },
      {
        "items": [
          {
            "id": 18,
            "name": "Sale By Brand",
            "color": "purple",
            "method": "getSaleByBrand"
          }
        ]
      }
    ]
  },
  {
    "columns": [
      {
        "items": [
          {
            "id": 19,
            "name": "Fraud Control",
            "color": "purple",
            "method": "getFraudControl"
          }
        ]
      }
    ]
  },
  {
    "columns": [
      {
        "items": [
          {
            "id": 20,
            "name": "Area Demographic",
            "color": "purple",
            "method": "getSaleByDemographicArea"
          }
        ]
      },
      {
        "items": [
          {
            "id": 21,
            "name": "Net Promoters",
            "color": "purple",
            "method": "getFeedback"
          }
        ]
      },
      {
        "items": [
          {
            "id": 22,
            "name": "Sale By Weekday",
            "color": "purple",
            "method": "getSaleByWeekEnd"
          }
        ]
      }
    ]
  },
  // {
  //   "columns": [
  //     {
  //       "items": [
  //         {
  //           "id": 23,
  //           "name": "Supplier Perfomance",
  //           "color": "purple",
  //           "method": "getSupplierStatement"
  //         }
  //       ]
  //     },
  //     {
  //       "items": [
  //         {
  //           "id": 4,
  //           "name": "Payment Mode",
  //           "color": "yellow",
  //           "method": "getSaleByMOP"
  //         }
  //       ]
  //     },
  //     {
  //       "items": [
  //         {
  //           "id": 5,
  //           "name": "Tax & Discount",
  //           "color": "purple",
  //           "method": "getTaxAndDisount"
  //         }
  //       ]
  //     },
  //     {
  //       "items": [
  //         {
  //           "id": 24,
  //           "name": "Sale By Shift",
  //           "color": "purple",
  //           "method": "getSalesByShift"
  //         }
  //       ]
  //     }
  //   ]
  // }
];