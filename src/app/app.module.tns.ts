import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from '@nativescript/angular';

import { AppRoutingModule } from '@src/app/app-routing.module';
import { AppComponent } from '@src/app/app.component';
import { TomatozComponent } from '@src/app/dashboard/tomatoz/tomatoz.component';
import { DashboardComponent } from '@src/app/dashboard/dashboard.component';

import { NativeScriptSvgModule } from '@sergeymell/nativescript-svg/angular';
import { DigitalClockComponent } from '@src/app/dashboard/digital-clock/digital-clock.component';
import { SettingsComponent } from '@src/app/dashboard/settings/settings.component';
// Uncomment and add to NgModule imports if you need to use two-way binding and/or HTTP wrapper
import { NativeScriptFormsModule, NativeScriptHttpClientModule } from '@nativescript/angular';
import { ControlsComponent } from '@src/app/dashboard/controls/controls.component';
import { TouchScaleDirective } from './shared/directives/touch-scale.directive';

@NgModule({
  declarations: [
    AppComponent,
    TomatozComponent,
    DashboardComponent,
    DigitalClockComponent,
    SettingsComponent,
    ControlsComponent,
    TouchScaleDirective
  ],
  imports: [
    NativeScriptModule,
    NativeScriptFormsModule,
    NativeScriptSvgModule,
    NativeScriptHttpClientModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
