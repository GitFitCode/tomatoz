import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TomatozComponent } from '@src/app/dashboard/tomatoz/tomatoz.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { DigitalClockComponent } from '@src/app/dashboard/digital-clock/digital-clock.component';
import { SettingsComponent } from '@src/app/dashboard/settings/settings.component';



@NgModule({
  declarations: [
    AppComponent,
    TomatozComponent,
    DashboardComponent,
    DigitalClockComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forFeature('dashboard', ),
    InlineSVGModule.forRoot({
      baseUrl: 'http://localhost:4200' //TODO: This should be dynamic
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
