import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { environment } from 'src/environments/environment';

import { ThaiDatePipe } from './pipes/thaidate.pipe';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReferInComponent } from './pages/refer-in/refer-in.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ReferOutComponent } from './pages/refer-out/refer-out.component';
import { ReferBackComponent } from './pages/refer-back/refer-back.component';
import { ReferBackDetailComponent } from './pages/refer-back-detail/refer-back-detail.component';
import { ReferOutDetailComponent } from './pages/refer-out-detail/refer-out-detail.component';
import { ReferInDetailComponent } from './pages/refer-in-detail/refer-in-detail.component';
import { ContentHeaderComponent } from './layouts/content-header/content-header.component';



@NgModule({
  declarations: [
    ThaiDatePipe,
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    ReferInComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MonitorComponent,
    ReferOutComponent,
    ReferBackComponent,
    ReferBackDetailComponent,
    ReferOutDetailComponent,
    ReferInDetailComponent,
    ContentHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: 'apiUrl', useValue: environment.apiUrl },
    { provide: 'SECRET_KEY', useValue: environment.SECRET_KEY },
    { provide: 'TOKENNAME', useValue: environment.tokenName },
    { provide: 'SYSTEMNAME', useValue: environment.systemName },
    { provide: 'RERFERPATH', useValue: environment.pathRoute }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
