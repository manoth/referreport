import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PageNotFoundComponent
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
    { provide: 'SYSTEMNAME', useValue: environment.systemName }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
