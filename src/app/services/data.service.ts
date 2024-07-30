import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Injectable, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

// const API_URL = environment.baseurl
// let rcid = environment.rcid;
let fyOfStart = '';
let fyOfEnd = ''
let _userData: any = {}




@Injectable({
  providedIn: 'root'
})
export class DataService {
  public selectedLocation: number = 0;
  public selectedDates: any;
  public rcid: string = '';
  public API_URL: string = '';


  // private locationSubject = new BehaviorSubject<any>(null);
  // locdata$ = this.locationSubject.asObservable();
  // setLocation(data: any) {
  //   this.locationSubject.next(data);
  // }


  constructor(private http: HttpClient) {
    this.getSavedStorage();
  }

  public getSavedStorage() {
    let _year = new Date();
    const _year1 = new Date();
    _year.setFullYear(_year.getFullYear());
    _year1.setFullYear(_year1.getFullYear() + 1);
    // console.log(_year);
    // console.log(_year1);

    fyOfStart = (sessionStorage.getItem('financialYearStart') !== null && sessionStorage.getItem('financialYearStart').length > 0) ? moment(sessionStorage.getItem('financialYearStart')).format('YYYY/MM/DD')+' 00:00' : _year+'/04/01 00:00';
    fyOfEnd = (sessionStorage.getItem('financialYearEnd') !== null && sessionStorage.getItem('financialYearEnd').length > 0) ? moment(sessionStorage.getItem('financialYearEnd')).format('YYYY/MM/DD')+ ' 23:39' : _year1+'/03/31 23:39';

    // fyOfStart = (localStorage.getItem('fy') !== null && JSON.parse(localStorage.getItem('fy')).length > 0) ? moment(JSON.parse(localStorage.getItem('fy'))[0].FinancialYear).format('YYYY/MM/DD')+' 00:00' : _year+'04/01 00:00';
    // fyOfEnd = (localStorage.getItem('fy') !== null && JSON.parse(localStorage.getItem('fy')).length > 0) ? moment(JSON.parse(localStorage.getItem('fy'))[0].FinancialYear).add(1, 'year').subtract(1, 'day').format('YYYY/MM/DD')+ ' 23:39' : _year1+'03/31 23:39';
    _userData = localStorage.getItem('user') !== null ? JSON.parse(localStorage.getItem('user')) : 0;
    this.rcid = localStorage.getItem('rcId');
    if (this.rcid) {
      if (this.rcid.length <= 7) {
        this.API_URL = environment.serverurl + "/api/execute-mobi-data";
      } else {
        this.API_URL = "http://" + this.rcid + "/ExecuteMobiData";
      }
    }

  }

  public formatDate(date: Date): string {
    return date.getFullYear() + '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('0' + date.getDate()).slice(-2)
  }

  public getNumberFormat(val: any) {
    if (val && val !== 0) {
      return new Intl.NumberFormat("en-IN").format(val);
    } else {
      return ''
    }
  }

  customInrFormat(value) {
    if (typeof value !== 'number' || isNaN(value)) {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(0);
    } else {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
    }
  };

  isNumber(value: any): boolean {
    return typeof value === 'number';
  }

  isCurrency(value: any, key: string): boolean {
    const currencyFields = ['price', 'cost', 'amount', 'value'];
    const isLikelyCurrencyField = currencyFields.includes(key.toLowerCase());
    return this.isNumber(value) && (isLikelyCurrencyField);
  }


  // getHeaderData(): Promise<{ [key: string]: string }> {
  //   return this.http.get<any>(`${this.API_URL}`, { observe: 'response' })
  //     .toPromise()
  //     .then(response => this.parseHeaders(response.headers));
  // }

  // private parseHeaders(headers: HttpHeaders): { [key: string]: string } {
  //   const headersObject: { [key: string]: string } = {};
  //   headers.keys().forEach(key => {
  //     headersObject[key] = headers.get(key);
  //   });
  //   return headersObject;
  // }





  public getTotalsSales = (startDate: string, endDate: string) => {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let param = `{"option":"GetDashboardData","projectName":"FusionMobi","DateFrom":"` + startDate + ` 00:00","DateTo":"` + endDate + ` 23:59"}`
    let paramList = JSON.stringify({ "paramList": encodeURIComponent(param) });
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "InitializeMobi", "rcId": this.rcid, "parameterList": `` + paramList + ``, "xmlAvailable": false }
    return this.http
      .post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getAllLocationSales = (startDate, endDate) => {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let param = `{"option":"GetDashboardData","projectName":"FusionMobi","DateFrom":"` + startDate + ` 00:00","DateTo":"` + endDate + ` 23:59"}`
    let paramList = JSON.stringify({ "paramList": encodeURIComponent(param) });
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "InitializeMobi", "rcId": this.rcid, "parameterList": `` + paramList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getmultiLocationData = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 72, iDuration: 0, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'reportdate': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getTotalSales = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 54, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate,'reportdate': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByServiceType = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 53, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({'startdateRange': startDate, 'enddateRange': endDate, 'reportdate': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByMOP = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 55, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByItem = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 35, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getTaxAndDisount = (startDate, endDate) => {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let param = `{"option":"GetDashboardSaleData","projectName":"FusionMobi","DateStart":"` + startDate + `","DateFrom":"` + startDate + `","DateTo":"` + endDate + ` 23:59"}`
    let paramList = JSON.stringify({ "paramList": encodeURIComponent(param) });
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "InitializeMobi", "rcId": this.rcid, "parameterList": `` + paramList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getFeedback = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 58, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getCustomes = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 52, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByTime = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 44, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getFraudControl = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({
      teamID: _userData?.teamID, reportName: 56, iDuration: 8, iLocationID: locationid, ioption: 0,
      financialYearStart: startDate +' 00:00', financialYearEnd: endDate + ' 23:59', scaleValue: 1, strDayStartHr: 0,
      strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate })
    })
    //`{\"teamID\":\"5\", \"reportName\":\"56\", \"iDuration\":0, \"iLocationID\":\"0\",\"ioption\":0,\"financialYearStart\":\"03/31/2024\", \"financialYearEnd\":\"03/30/2025\", \"scaleValue\": \"1\", \"strDayStartHr\":\"0\", \"strOptionalParameter\" : \"{'reportdate': '05/13/2024'}\"}`;

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


  public getSaleByTicket = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 45, iDuration: 8, iLocationID: locationid, ioption: 2, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate, 'clickedDate': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


  public getSaleByDepartment = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 3, iDuration: 8, iLocationID: locationid, ioption: 2, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    // let parameterList = `{\"teamID\":\"5\", \"reportName\":\"3\", \"iDuration\":0, \"iLocationID\":0,\"ioption\":2,\"financialYearStart\":\"03/31/2024\", \"financialYearEnd\":\"03/30/2025\", \"scaleValue\": \"1\", \"strDayStartHr\":\"0\", \"strOptionalParameter\" : \"{}\"}`;
    //let parameterList = `{\"teamID\":\"5\", \"reportName\":\"3\", \"iDuration\":8, \"iLocationID\":0,\"ioption\":2,\"financialYearStart\":\"03/31/2024\", \"financialYearEnd\":\"03/30/2025\", \"scaleValue\": \"1\", \"strDayStartHr\":\"0\", \"strOptionalParameter\" : \"{'startdateRange': '01/01/2024 0:00', 'enddateRange': '05/15/2024 0:00', 'startdateRange': '01/01/2024 0:00', 'enddateRange': '05/15/2024 0:00'}\"}`;
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    // console.log(JSON.stringify(data));
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByGroup = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 3, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false };
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleBySubGroup = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 3, iDuration: 8, iLocationID: locationid, ioption: 1, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByBrand = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 3, iDuration: 8, iLocationID: locationid, ioption: 3, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }



  public getProfitAndLoss = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 30, iDuration: 8, iLocationID: locationid, ioption: 2, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getCashAndBank = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 5, iDuration: 8, iLocationID: locationid, ioption: 2, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getPurchase = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 4, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate + ' 0:00', 'enddateRange': endDate + ' 0:00' }) })
    //`{\"teamID\":\"5\", \"reportName\":\"4\", \"iDuration\":8, \"iLocationID\":0,\"ioption\":0,\"financialYearStart\":\"03/31/2024\", \"financialYearEnd\":\"03/30/2025\", \"scaleValue\": \"1\", \"strDayStartHr\":\"0\", \"strOptionalParameter\" : \"{'startdateRange': '01/01/2024 0:00', 'enddateRange': '05/14/2024 0:00'}\"}`
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


  public getSaleByDemographicArea = (startDate, endDate, locationid) => {
    //{"teamID":"5", "reportName":"64", "iDuration":0, "iLocationID":"15","ioption":0,"financialYearStart":"03/31/2024", "financialYearEnd":"03/30/2025", "scaleValue": "1", "strDayStartHr":"0", "strOptionalParameter" : "{'reportdate': '05/15/2024'}"}

    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 64, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate,'reportdate': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSupplierStatement = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 40, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getRatioAnalysis = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 7, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByWeekEnd = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 32, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate, 'enddateRange': endDate }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


  public getSalesByShift = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 46, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate + ' 0:00', 'enddateRange': endDate + ' 0:00' }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public getSaleByLocation() {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": "{\"teamID\":\"1\", \"reportName\":\"36\", \"iDuration\":8, \"iLocationID\":\" All Company \",\"ioption\":0,\"financialYearStart\":\"04/01/2024\", \"financialYearEnd\":\"03/31/2025\", \"scaleValue\": \"1\", \"strDayStartHr\":\"0\", \"strOptionalParameter\" : \"{'startdateRange': '04/01/2024 0:00', 'enddateRange': '04/19/2024 0:00'}\"}", "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


  public getCashExpense = (startDate, endDate, locationid) => {
    let parameterList = JSON.stringify({ teamID: _userData?.teamID, reportName: 73, iDuration: 8, iLocationID: locationid, ioption: 0, financialYearStart: fyOfStart, financialYearEnd: fyOfEnd, scaleValue: 1, strDayStartHr: 0, strOptionalParameter: JSON.stringify({ 'startdateRange': startDate + ' 0:00', 'enddateRange': endDate + ' 0:00' }) })
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetReportData", "rcId": this.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }


}
