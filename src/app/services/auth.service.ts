import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders } from '@angular/common/http';
import * as xml2js from 'xml-js';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import notify from 'devextreme/ui/notify';

import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface IUser {
  email: string;
  name?: string;
  avatarUrl?: string;
  designationID?: number;
  isActive?: number;
  locationID?: number;
  logSession?: number;
  teamID?: number;
  userID?: number;
  userName?: string;
  canLogin?: number;
}
export interface IResponse {
  isOk: boolean;
  data?: IUser;
  message?: string;
}

export const defaultUser: IUser = {
  email: '',
  name: '',
  avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
};

// const API_URL = environment.baseurl
// const rcid = environment.rcid;
const defaultPath = '/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public _user: IUser | null = defaultUser;
  public _lastAuthenticatedPath: string = defaultPath;

  private _service;
  public isAccessRequired: boolean = true;
  public API_URL: string = '';

  constructor(private router: Router, private http: HttpClient, service: DataService) {
    this._service = service;

  }

  get loggedIn(): boolean {
    let userData = localStorage.getItem('user');
    let fy = sessionStorage.getItem('financialYearStart');
    if (userData && fy) {
      this._user = JSON.parse(userData);
      return true;
    } else {
      return false;
    }
    // return !!this._user;
  }

  set lastAuthenticatedPath(value: string) {
    this._lastAuthenticatedPath = value;
  }

  async logIn(email: string, password: string) {
    if (this._service.rcid.length <= 7) {
      this.API_URL = environment.serverurl + "/api/execute-mobi-data";
    } else {
      this.API_URL = "http://" + this._service.rcid + "/ExecuteMobiData";
    }

    try {
      let headers = new HttpHeaders();
      let parameterList = JSON.stringify({ userName: email, password: password })
      headers = headers.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.UmFuY2VMYWI.5ENAqVQaq_uU74z_pX3UBShjxdh8xb4b2OcZwOZOZVk');
      let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "ValidateLoginMobi", "rcId": this._service.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }

      this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false }).subscribe((r: any) => {
        if (r && r.ExecuteMobiDataResult[0].length > 0) {
          const options = { compact: true, ignoreComment: true, spaces: 4 };
          const jsonResult = xml2js.xml2json(r.ExecuteMobiDataResult[0], options);
          let userJson = JSON.parse(jsonResult);
          let defaultUser = {
            email: email,
            name: userJson.UserMasters.userMaster.PrintName._text,
            avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
            canLogin: userJson.UserMasters.userMaster.CanLogin._text,
            designationID: userJson.UserMasters.userMaster.DesignationID._text,
            isActive: userJson.UserMasters.userMaster.IsActive._text,
            locationID: userJson.UserMasters.userMaster.LocationID._text,
            logSession: userJson.UserMasters.userMaster.LogSession._text,
            teamID: userJson.UserMasters.userMaster.TeamID._text,
            userID: userJson.UserMasters.userMaster.UserID._text,
          }
          this._user = { ...defaultUser, email };
          localStorage.setItem('user', JSON.stringify(this._user));
          this.getDataAfterLogin(defaultUser.userID, defaultUser.teamID, defaultUser.designationID).subscribe(r => {
            localStorage.setItem('fy', r.ExecuteMobiDataResult[7]);
            localStorage.setItem('location', r.ExecuteMobiDataResult[8]);

            this._service.getSavedStorage();
            this.router.navigate([this._lastAuthenticatedPath]);
          });

          return {
            isOk: true,
            data: this._user,
          };
        }
        else {
          return {
            isOk: false,
            message: 'Authentication failed',
          };
        }
      });

      return {
        isOk: false,
        message: 'Authentication failed',
      };
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  }


  //////////////////

  // public login = (email, password) => {
  //   this.validateLogin(email, password).subscribe((r: any) => {
  //     if (r && r.ExecuteMobiDataResult[0].length > 0) { 
  //       let defaultUser = this.saveUserData(email,r.ExecuteMobiDataResult[0]);
  //       this._user = { ...defaultUser, email };
  //       localStorage.setItem('user', JSON.stringify(this._user));

  //       this.getDataAfterLogin(defaultUser.userID, defaultUser.teamID, defaultUser.designationID).subscribe(r => {
  //         localStorage.setItem('fy', r.ExecuteMobiDataResult[7]);
  //         localStorage.setItem('location', r.ExecuteMobiDataResult[8]);

  //         this._service.getSavedStorage();
  //         this.router.navigate([this._lastAuthenticatedPath]);

  //         return true;
  //       });

  //       return {
  //         isOk: true,
  //         data: this._user,
  //       };
  //     }
  //   });
  // }

  // public login = (email, password) => {
  //   this.validateLogin(email, password).subscribe(r => {
  //     if (r && r.ExecuteMobiDataResult[0].length > 0) {
  //       let defaultUser = this.saveUserData(email, r.ExecuteMobiDataResult[0]);
  //       this._user = { ...defaultUser, email };
  //       localStorage.setItem('user', JSON.stringify(this._user));
  //       return {
  //         isOk: true,
  //         data: this._user,
  //       };
  //     } else {
  //       return {
  //         isOk: false,
  //         message: 'Authentication failed',
  //       };
  //     }
  //   })
  // }

  saveUserData(email, data: any): any {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    const jsonResult = xml2js.xml2json(data, options);
    let userJson = JSON.parse(jsonResult);
    let defaultUser = {
      email: email,
      name: userJson.UserMasters.userMaster.PrintName._text,
      avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
      canLogin: userJson.UserMasters.userMaster.CanLogin._text,
      designationID: userJson.UserMasters.userMaster.DesignationID._text,
      isActive: userJson.UserMasters.userMaster.IsActive._text,
      locationID: userJson.UserMasters.userMaster.LocationID._text,
      logSession: userJson.UserMasters.userMaster.LogSession._text,
      teamID: userJson.UserMasters.userMaster.TeamID._text,
      userID: userJson.UserMasters.userMaster.UserID._text,
    }
    return defaultUser;
  }

  validateLogin(email, password) {
    if (this._service.rcid.length <= 7) {
      this.API_URL = environment.serverurl + "/api/execute-mobi-data";
    } else {
      this.API_URL = "http://" + this._service.rcid + "/ExecuteMobiData";
    }

    let headers = new HttpHeaders();
    let parameterList = JSON.stringify({ userName: email, password: password })
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "ValidateLoginMobi", "rcId": this._service.rcid, "parameterList": `` + parameterList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false, reportProgress: true, observe: 'events' })
      // .pipe(
      //   map(event => this.getEventMessage(event)),
      //   catchError(() => of(0)) // In case of error, return 0 progress
      // );
      ;

    // .subscribe((r: any) => {
    //   if (r && r.ExecuteMobiDataResult[0].length > 0) {
    //     const options = { compact: true, ignoreComment: true, spaces: 4 };
    //     const jsonResult = xml2js.xml2json(r.ExecuteMobiDataResult[0], options);
    //     let userJson = JSON.parse(jsonResult);
    //     let defaultUser = {
    //       email: email,
    //       name: userJson.UserMasters.userMaster.PrintName._text,
    //       avatarUrl: 'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/01.png',
    //       canLogin: userJson.UserMasters.userMaster.CanLogin._text,
    //       designationID: userJson.UserMasters.userMaster.DesignationID._text,
    //       isActive: userJson.UserMasters.userMaster.IsActive._text,
    //       locationID: userJson.UserMasters.userMaster.LocationID._text,
    //       logSession: userJson.UserMasters.userMaster.LogSession._text,
    //       teamID: userJson.UserMasters.userMaster.TeamID._text,
    //       userID: userJson.UserMasters.userMaster.UserID._text,
    //     }
    //     this._user = { ...defaultUser, email };
    //     localStorage.setItem('user', JSON.stringify(this._user));
    //     this.getDataAfterLogin(defaultUser.userID, defaultUser.teamID, defaultUser.designationID).subscribe(r => {
    //       localStorage.setItem('fy', r.ExecuteMobiDataResult[7]);
    //       localStorage.setItem('location', r.ExecuteMobiDataResult[8]);

    //       this._service.getSavedStorage();
    //       this.router.navigate([this._lastAuthenticatedPath]);
    //     });

    //     return {
    //       isOk: true,
    //       data: this._user,
    //     };
    //   }
    //   // else {
    //   //   return {
    //   //     isOk: false,
    //   //     message: 'Authentication failed',
    //   //   };
    //   // }
    // });
  }

  private getEventMessage(event: HttpEvent<any>): number {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return Math.round((100 * event.loaded) / event.total);
      case HttpEventType.Response:
        return 100;
      default:
        return 0;
    }
  }



  async getUser() {
    try {
      let userData = localStorage.getItem('user');
      if (userData) {
        this._user = JSON.parse(userData)
      }
      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        data: null,
      };
    }
  }

  getDataAfterLogin(userid, teamid, designationid) {
    if (this._service.rcid.length <= 7) {
      this.API_URL = environment.serverurl + "/api/execute-mobi-data";
    } else {
      this.API_URL = "http://" + this._service.rcid + "/ExecuteMobiData";
    }

    let headers = new HttpHeaders();
    let param = JSON.stringify({ designationID: designationid, option: 'GetDataOnPageLoadOrLogin', teamID: teamid, projectName: 'FusionMobi', userID: userid, stationID: 1 })
    headers = headers.set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.UmFuY2VMYWI.5ENAqVQaq_uU74z_pX3UBShjxdh8xb4b2OcZwOZOZVk');
    let paramList = JSON.stringify({ "paramList": encodeURIComponent(param) });
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "InitializeMobi", "rcId": this._service.rcid, "parameterList": `` + paramList + ``, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  async logOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  async gotoDashboard() {
    try {
      this.getUser();
      this.router.navigate([this._lastAuthenticatedPath]);
      return {
        isOk: true,
        data: this._user,
      };
    } catch {
      return {
        isOk: false,
        message: 'Authentication failed',
      };
    }
  }


  public getRunningVersion(newRcid: string) {
    if (newRcid.length <= 7) {
      this.API_URL = environment.serverurl + "/api/execute-mobi-data";
    } else {
      this.API_URL = "http://" + newRcid + "/ExecuteMobiData";
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `${environment.auth}`);
    let data = { "dllName": "RanceLab.Mobi.ver.1.0.dll", "className": "Mobi.MobiHelper", "methodName": "GetRunningVersionMobi", "rcId": newRcid, "parameterList": `{}`, "xmlAvailable": false }
    return this.http.post<any>(`${this.API_URL}`, data, { headers, withCredentials: false });
  }

  public showMsg(message, type) {
    notify({
      message,
      position: {
        my: 'center bottom',
        at: 'center bottom',
      },
    }, type, 3000);
  }


}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // const isLoggedIn = this.authService.loggedIn;

    // if (isLoggedIn) {
    //   this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    // } else {
    //   this.router.navigate(['/auth/login']);
    // }
    // return isLoggedIn;

    const isLoggedIn = this.authService.loggedIn;
    const isAuthForm = [
      'login',
      'reset-password',
      'create-account',
      'change-password/:recoveryCode',
    ].includes(route.routeConfig?.path || defaultPath);

    // if (!isLoggedIn && isAuthForm) {
    //   this.router.navigate(['/auth/login']);
    // }

    if (isLoggedIn) {
      this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    }

    return isLoggedIn || isAuthForm;


    // const isAuthForm = [
    //   'login',
    //   'reset-password',
    //   'create-account',
    //   'change-password/:recoveryCode'
    // ].includes(route.routeConfig?.path || defaultPath);

    // if (!isLoggedIn && isAuthForm) { 
    //   this.router.navigate(['/auth/login']);
    // }

    // if (isLoggedIn) {
    //   this.authService.lastAuthenticatedPath = route.routeConfig?.path || defaultPath;
    // }

    // return isLoggedIn || isAuthForm;
  }
}
