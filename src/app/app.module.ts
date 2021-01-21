import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { InlineSVGModule } from 'ng-inline-svg';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TomatozComponent } from '@src/app/tomatoz/tomatoz.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    TomatozComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot({
      baseUrl: 'http://localhost:4200' //TODO: This should be dynamic
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
