import { DynamicCardOptions } from 'src/app/types/resource';
import { DataService } from '../services';
import { ServiceInjector } from '../services/service-injector';


export const currencyText = (cellInfo: any) => {
    const myService = ServiceInjector.getService(DataService);
    const formattedValue = myService.customInrFormat(cellInfo.value);
    return `${formattedValue}`;
}

export const numberText = (cellInfo: any) => {
    const myService = ServiceInjector.getService(DataService);
    const formattedValue = myService.getNumberFormat(cellInfo.value);
    return `${formattedValue}`;
}


export const saleOptions: DynamicCardOptions = {
    cardTitle: 'Sale',
    showDateRamge: true,
    showPercentage: true,
    subHeader: [{ key: 'Target', val: 0 }, { key: 'Achievement', val: 0 }],
    dataTable: [{ Particular: 'Today', Invoice: 0, Amount: 0 }, { Particular: 'MTD', Invoice: 0, Amount: 0 }, { Particular: 'YTD', Invoice: 0, Amount: 0 }],
    showTableHeader: false,
    footerText: 'Average Ticket Size : ',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: false,
    isDropDownVisible: true,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: undefined,
    addTopBlankRowOnCard: false,
    columnMap: [],
    gridColumn: [],
    isLoading: true
}

export const purchaseOptions: DynamicCardOptions = {
    cardTitle: 'Purchase',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: [],
    showTableHeader: true,
    footerText: 'More',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: false,
    isDropDownVisible: true,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 3,
    addTopBlankRowOnCard: true,
    columnMap: [
        { dataField: 'name', caption: '' },
        { dataField: 'count', caption: 'Invoice' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [],
    isLoading: true
}

export const ordersOptions: DynamicCardOptions = {
    cardTitle: 'Orders',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: true,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 4,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'orders', caption: 'Orders#' },
        { dataField: 'value', caption: 'Amount' },
        { dataField: 'ticket', caption: 'Ticket' },
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'orders', caption: 'Orders#', customizeText: numberText },
        { dataField: 'value', caption: 'Amount(₹)', customizeText: currencyText },
        { dataField: 'contribution', caption: 'Contribution(%)' },
        { dataField: 'ticket', caption: 'Ticket', cssClass: 'dx-right-align' }
    ],
    isLoading: true
}

export const mopOptions: DynamicCardOptions = {
    cardTitle: 'Payment Mode',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: true,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 3,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'contribution', caption: 'Cont %' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount(₹)', customizeText: currencyText },
        { dataField: 'contribution', caption: 'Contribution(%)', customizeText: numberText }
    ],
    isLoading: true
}

export const taxDiscountOptions: DynamicCardOptions = {
    cardTitle: 'Taxes & Discount',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 0,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount' },
    ],
    gridColumn: [
        { dataField: 'group', caption: 'Group', groupIndex: 0 },
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount(₹)', customizeText: currencyText }
    ],
    isLoading: true
}


export const topSaleOptions: DynamicCardOptions = {
    cardTitle: 'Top Sale',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: undefined,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 0,
    columnMap: [
        { dataField: 'name', caption: 'Group' },
        { dataField: 'orders', caption: 'Contr %' },
        { dataField: 'value', caption: 'Amount' },
    ],
    gridColumn: [
        { dataField: 'group', caption: 'Group', groupIndex: 0 },
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'quantity', caption: 'Quantity', customizeText: numberText },
        { dataField: 'value', caption: 'Amount(₹)', customizeText: currencyText }
    ],
    isLoading: true
}

export const feedbackOptions: DynamicCardOptions = {
    cardTitle: 'Feedback',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: true,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'orders', caption: 'Count' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Value', customizeText: numberText }
    ],
    isLoading: true
}

export const customerOptions: DynamicCardOptions = {
    cardTitle: 'Customers',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'count', caption: 'Value' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'count', caption: 'Value', customizeText: numberText }
    ],
    isLoading: true
}

export const cashBankOptions: DynamicCardOptions = {
    cardTitle: 'Cash & Bank',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount', customizeText: numberText }
    ],
    isLoading: true
}

export const ratioAnalysisOptions: DynamicCardOptions = {
    cardTitle: 'Ratio Analysis',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount', customizeText: numberText }
    ],
    isLoading: true
}

export const supplierCardOptions: DynamicCardOptions = {
    cardTitle: 'Supplier Perfomance',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'value', caption: 'Amount', customizeText: numberText },
        { dataField: 'due', caption: 'Due' }
    ],
    isLoading: true
}

export const shiftCardOptions: DynamicCardOptions = {
    cardTitle: 'Sale By Shift',
    showDateRamge: true,
    showPercentage: false,
    subHeader: [],
    dataTable: undefined,
    showTableHeader: true,
    addTopBlankRowOnCard: false,
    footerText: '',
    groupData: false,
    showSumOnTop: false,
    showCountOnTop: false,
    isDetailViewVisible: true,
    isDropDownVisible: false,
    percentageVal: 0,
    countVal: 0,
    dropDownMenu: undefined,
    columnLimit: 2,
    columnMap: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'count', caption: 'Contr%' },
        { dataField: 'value', caption: 'Amount' }
    ],
    gridColumn: [
        { dataField: 'name', caption: 'Particular' },
        { dataField: 'count', caption: 'Contribution' },
        { dataField: 'value', caption: 'Amount', customizeText: numberText }
    ],
    isLoading: true
}