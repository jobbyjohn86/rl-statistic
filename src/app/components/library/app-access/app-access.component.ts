import {
  Component, NgModule, Input, Output, EventEmitter, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { AuthService, DataService, IUser } from 'src/app/services';
import { ThemeSwitcherModule } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { Router } from '@angular/router';
import { UserPanelModule } from '../user-panel/user-panel.component';
import { DxFormModule, DxPopupModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-access',
  templateUrl: 'app-access.component.html',
  styleUrls: ['./app-access.component.scss'],
})

export class AppAccessComponent implements OnInit{

  rcidForm: any = {
    value: ''
  };

  @Input() isAccessRequired: boolean = true;

  constructor(private authService: AuthService, private router: Router, private service: DataService) {
    // this.isAccessRequired=this.authService.isAccessRequired;
  }
  ngOnInit(): void {
    this.rcidForm.value=localStorage.getItem('rcId');
  }



  onSaveRCID() {
    if (this.rcidForm.value.length > 0) {
      this.authService.getRunningVersion(this.rcidForm.value).subscribe(r => {
        if (r.ExecuteMobiDataResult.length > 0) {
          let retData = JSON.parse(r.ExecuteMobiDataResult[0]);
          if (retData.length > 0) {
            localStorage.clear();
            localStorage.setItem('rcId', this.rcidForm.value);
            this.router.navigate(['/auth/login']);
            
            this.isAccessRequired = false;
            this.service.getSavedStorage();
            this.authService.showMsg(`Service Access Successful`, 'success');
            
          } else {
            this.authService.showMsg(`Invalid RCID, Please use correct RCID to Access the Application`, 'warning');
          }
        } else {
          this.authService.showMsg(`Invalid RCID, Please use correct RCID to Access the Application`, 'warning');
        }
      }, error => {
        console.log(error);
        notify(error.error, 'error', 2000);
      }
      );
    } else {
      this.authService.showMsg(`Invalid RCID, Please use correct RCID to Access the Application`, 'warning');
    }
  }


  onPopupHidden(){
    // this.authService.isAccessRequired=false;
  }

}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule,
    ThemeSwitcherModule,
    DxPopupModule,
    DxFormModule
  ],
  declarations: [AppAccessComponent],
  exports: [AppAccessComponent],
})
export class AppAccessModule { }
