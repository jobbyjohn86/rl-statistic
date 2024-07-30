import {
  Component, NgModule, Input, Output, EventEmitter, OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

// import { UserPanelModule } from '../user-panel/user-panel.component';
import { AuthService, IUser } from 'src/app/services';
import { ThemeSwitcherModule } from 'src/app/components/library/theme-switcher/theme-switcher.component';
import { Router } from '@angular/router';
import { UserPanelModule } from '../user-panel/user-panel.component';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})

export class AppHeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  user: IUser | null = { email: '' };

  userMenuItems = [
    {
      text: 'Logout',
      icon: 'runner',
      onClick: () => {
        this.authService.logOut();
      },
    }];

  locationData: any = [];

  // @Output() selectionChanged = new EventEmitter<any>();


  constructor(private authService: AuthService, private router: Router) { 
    // this.openLocationAnalysis= this.openLocationAnalysis.bind(this);
  }

  ngOnInit() {
    this.authService.getUser().then((e) => this.user = e.data);

    // this.locationData = [{ name: 'All Location', value: 0 }, { name: 'Root', value: 1 }, { name: 'Branch', value: 2 }]
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };

  // openLocationAnalysis(e: any) {
  //   // this.selectionChanged.emit(e.value);
  //   // if (e.value > 0) {
  //   //   this.selectionChanged.emit(e.value);
  //   //   // this.router.navigate(['/analytics-sales-report']);
  //   //   // this.selectionChanged.emit(e.value);
  //   // } else {
  //   //   this.router.navigate(['/analytics-dashboard']);
  //   // }
  // }


  // selectionChange(e: any) {
  //   this.selectionChanged.emit(e.value);
  // }


}

@NgModule({
  imports: [
    CommonModule,
    DxButtonModule,
    DxToolbarModule,
    ThemeSwitcherModule,
    UserPanelModule,
  ],
  declarations: [AppHeaderComponent],
  exports: [AppHeaderComponent],
})
export class AppHeaderModule { }
