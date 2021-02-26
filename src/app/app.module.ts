import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';
import { StoreModule } from "@ngrx/store";

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TomatozComponent } from '@src/app/dashboard/tomatoz/tomatoz.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { DigitalClockComponent } from '@src/app/dashboard/digital-clock/digital-clock.component';
import { SettingsComponent } from '@src/app/dashboard/settings/settings.component';
import { ControlsComponent } from '@src/app/dashboard/controls/controls.component';
import { TouchScaleDirective } from '@src/app/shared/directives/touch-scale.directive';
import * as fromApp from '@src/app/store/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    TomatozComponent,
    DashboardComponent,
    DigitalClockComponent,
    SettingsComponent,
    ControlsComponent,
    TouchScaleDirective,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot({
      baseUrl: 'http://localhost:4200' //TODO: This should be dynamic
    }),
    StoreModule.forRoot(fromApp.appReducer),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
