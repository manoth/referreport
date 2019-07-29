import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

import { LoginComponent } from './login/login.component';
import { MonitorComponent } from './monitor/monitor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ReferInComponent } from './pages/refer-in/refer-in.component';
import { ReferOutComponent } from './pages/refer-out/refer-out.component';
import { ReferBackComponent } from './pages/refer-back/refer-back.component';
import { ReferInDetailComponent } from './pages/refer-in-detail/refer-in-detail.component';
import { ReferOutDetailComponent } from './pages/refer-out-detail/refer-out-detail.component';
import { ReferBackDetailComponent } from './pages/refer-back-detail/refer-back-detail.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'monitor', component: MonitorComponent },
  {
    path: '', component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: '', redirectTo: 'referin', pathMatch: 'full' },
      { path: 'referin', component: ReferInComponent },
      { path: 'referin/:referId', component: ReferInDetailComponent },
      { path: 'referout', component: ReferOutComponent },
      { path: 'referout/:referId', component: ReferOutDetailComponent },
      { path: 'referback', component: ReferBackComponent },
      { path: 'referback/:referId', component: ReferBackDetailComponent }
    ]
  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
