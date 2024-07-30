import { CurrencyPipe, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppFooterModule, LoadProgresModule, LoginFormModule, TickerCardModule } from './components';
import { SideNavOuterToolbarModule, SingleCardModule, UnauthenticatedContentModule } from './layouts';
import { AuthService, ScreenService, AppInfoService, ThemeService, DataService } from './services';
import { ServiceInjector } from './services/service-injector';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SideNavOuterToolbarModule,
    SingleCardModule,
    AppFooterModule,
    // LoginFormModule,
    LoadProgresModule,
    UnauthenticatedContentModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService, ScreenService, AppInfoService, ThemeService,DataService,DatePipe,CurrencyPipe,ServiceInjector],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(injector: Injector) {
    // Set the static injector on module initialization
    ServiceInjector.injector = injector;
  }
}
