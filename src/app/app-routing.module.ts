import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';
import { AuthGuardRegisterService } from './services/auth-guard-register.service';

import { LoginComponent } from './login/login.component';
import { MonitorComponent } from './monitor/monitor.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { ReferComponent } from './pages/refer/refer.component';
import { ReferDetailComponent } from './pages/refer-detail/refer-detail.component';
import { AdduserComponent } from './pages/adduser/adduser.component';
import { ListuserComponent } from './pages/listuser/listuser.component';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { ForgotComponent } from './forgot/forgot.component';
import { AmbulanceComponent } from './ambulance/ambulance.component';
import { ReportComponent } from './pages/report/report.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: 'monitor', component: MonitorComponent },
  { path: 'ambulance/:referId', component: AmbulanceComponent },
  {
    path: '', component: LayoutComponent,
    canActivate: [AuthGuardRegisterService],
    children: [
      { path: 'adduser', component: AdduserComponent },
      { path: 'editprofile/:username', component: AdduserComponent }
    ]
  },
  {
    path: '', component: LayoutComponent,
    canActivate: [AuthGuardService],
    children: [
      { path: 'referin', component: ReferComponent },
      { path: 'referin/:referId', component: ReferDetailComponent },
      { path: 'referout', component: ReferComponent },
      { path: 'referout/:referId', component: ReferDetailComponent },
      { path: 'referback', component: ReferComponent },
      { path: 'referback/:referId', component: ReferDetailComponent },
      { path: 'listuser', component: ListuserComponent },
      { path: 'editprofile', component: AdduserComponent },
      { path: 'chatroom', component: ChatroomComponent },
      { path: 'report/:id', component: ReportComponent },
    ]
  },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
