import { DashboardComponent } from './dashboard/dashboard.component';
import { Routes } from '@angular/router';


export const routes: Routes = [
  {
      path: '',
      redirectTo: '/tomatoz',
      pathMatch: 'full',
  },
  {
      path: 'tomatoz',
      component: DashboardComponent,
  },
];
