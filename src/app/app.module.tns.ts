import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TomatozComponent } from '@src/app/tomatoz/tomatoz.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';

import { NativeScriptSvgModule } from '@sergeymell/nativescript-svg/angular';
// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
// import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';

@NgModule({
  declarations: [
    AppComponent,
    TomatozComponent,
    DashboardComponent,
  ],
  imports: [
    NativeScriptModule,
    NativeScriptSvgModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
