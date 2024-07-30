
import { ChartOptions } from 'src/app/types/resource';

export const saleByTimeOptions: ChartOptions = {
    id: 'chart',
    title: 'Sale By Time',
    dataSource: [],
    chartType: 0,
    isRotated: false,
    palette: '',
    valueField: 'ThisMonth',
    valueName: 'Month',
    stack: 'ThisMonth',
    color: '#F4D03F',
    axisTitle: 'Amount (₹)',
    argTitle: 'Time',
    argCustomField: 'customizeText',
    argField: 'Hour',
    type: 'stackedBar',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleByTicketOptions: ChartOptions = {
    id: 'chart',
    title: 'Sale By Ticket Size',
    dataSource: [],
    chartType: 0,
    isRotated: true,
    palette: 'Violet',
    valueField: 'value',
    valueName: 'Count',
    stack: 'value',
    color: '#2ECC71',
    axisTitle: '',
    argTitle: 'Memo',
    argCustomField: '',
    argField: 'name',
    type: 'stackedBar',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleByDepartmentOptions: ChartOptions = {
    id: 'pie',
    title: 'Sale By Department',
    dataSource: [],
    chartType: 5,
    isRotated: true,
    palette: 'bright',
    valueField: 'TodayPercent',
    valueName: '',
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: 'customizeDepartmentLabel',
    argField: 'DepartmentName',
    type: '',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleByGroupOptions: ChartOptions = {
    id: 'pyramid',
    title: 'Sale By Group',
    dataSource: [],
    chartType: 11,
    isRotated: true,
    palette: 'Harmony light',
    valueField: 'TodayPercent',
    valueName: '',
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: '',
    argField: 'ProductGroupName',
    type: '',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleBySubGroupOptions: ChartOptions = {
    id: 'pie',
    title: 'Sale By Sub Group',
    dataSource: [],
    chartType: 4,
    isRotated: true,
    palette: 'bright',
    valueField: 'Today',
    valueName: '',
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: 'customiseSubGrpToolip',
    argField: 'SubGroupName',
    type: '',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleByBrandOptions: ChartOptions = {
    id: 'funnel',
    title: 'Sale By Brand',
    dataSource: [],
    chartType: 11,
    isRotated: true,
    palette: 'bright',
    valueField: 'TodayPercent',
    valueName: '',
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: 'customiseSubGrpToolip',
    argField: 'BrandName',
    type: '',
    argumentField: '',
    footer: '',
    class: '',
    isLegentVisible: false,
    seriesList: undefined,
    isLoading: false
}

export const saleByCustAreaOption: ChartOptions = {
    title: 'Customer by Demographics',
    palette: 'Carmine',
    argumentField: 'Area',
    valueField: 'Count',
    dataSource: [],
    footer: '', //Most Customers From:
    class: 'bar',
    isRotated: true,
    isLegentVisible: false,

    valueName: 'Area',
    id: '',
    chartType: 0,
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: '',
    argField: '',
    type: '',
    seriesList: undefined,
    isLoading: false
}

export const feedackGraphCardOption : ChartOptions = {
    title: 'Net Promoters Score',
    palette: 'Office',
    argumentField: 'name',
    valueField: 'value',
    dataSource: [
        { name: 'Detractors', value: 0, count: 0 },
        { name: 'Passives', value: 0, count: 0 },
        { name: 'Promoters', value: 0, count: 0 }
    ],
    footer: '',
    class: 'bar',
    isRotated: false,
    isLegentVisible: false,
    valueName: 'NPS',

    id: '',
    chartType: 0,
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: '',
    argField: '',
    type: '',
    seriesList: undefined,
    isLoading: false
};

export const saleWeekDayGraphCardOption: ChartOptions  = {
    title: 'Sale By Weekday',
    palette: 'Office',
    argumentField: 'WeekDayName',
    valueField: 'value',
    dataSource: [],
    footer: '',
    class: 'chart',
    seriesList: [
        { valueField: 'ThisWeek', name: 'ThisWeek' },
        { valueField: 'LastWeek', name: 'LastWeek' },
        { valueField: 'ThisMonth', name: 'ThisMonth' },
        { valueField: 'LastMonth', name: 'LastMonth' }
    ],

    id: '',
    chartType: 0,
    isRotated: false,
    valueName: '',
    stack: '',
    color: '',
    axisTitle: '',
    argTitle: '',
    argCustomField: '',
    argField: '',
    type: '',
    isLegentVisible: false,
    isLoading: false
}
