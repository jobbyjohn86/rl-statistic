import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { LoadProgressComponent, LoginFormComponent } from './components';
import { UnauthenticatedContentComponent, SideNavOuterToolbarComponent } from './layouts';
import { AnalyticsDashboardComponent } from './pages/analytics-dashboard/analytics-dashboard.component';
import { AnalyticsSalesReportComponent } from './pages/analytics-sales-report/analytics-sales-report.component';
import { CustomDashboardComponent } from './pages/custom-dashboard/custom-dashboard.component';
import { AuthGuardService, DataService } from './services';

const routes: Routes = [
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'login',
        component: LoadProgressComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ]
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'analytics-sales-report',
        component: AnalyticsSalesReportComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'custom-dashboard',
        component: CustomDashboardComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: '**',
        redirectTo: 'analytics-dashboard',
        pathMatch: 'full',
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes ,{ useHash: true, }),
    BrowserModule,
  ],
  providers: [AuthGuardService,DataService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
