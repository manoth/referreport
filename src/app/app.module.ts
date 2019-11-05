import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';

import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { environment } from 'src/environments/environment';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { MyDatePickerModule } from 'mydatepicker';
import { NgxQRCodeModule } from 'ngx-qrcode2';

import { ThaiDatePipe } from './pipes/thaidate.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { AgePipe } from './pipes/age.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { Nl2BrPipe } from './pipes/nl2br.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { SortByPipe } from './pipes/sortby.pipe';

import { DragDirective } from './directive/drag-drop.directive';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ReferComponent } from './pages/refer/refer.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { MonitorComponent } from './monitor/monitor.component';
import { ContentHeaderComponent } from './layouts/content-header/content-header.component';
import { ReferDetailComponent } from './pages/refer-detail/refer-detail.component';
import { Tab0Component } from './pages/refer-detail/tab0/tab0.component';
import { Tab1Component } from './pages/refer-detail/tab1/tab1.component';
import { Tab2Component } from './pages/refer-detail/tab2/tab2.component';
import { Tab3Component } from './pages/refer-detail/tab3/tab3.component';
import { Tab4Component } from './pages/refer-detail/tab4/tab4.component';
import { Tab5Component } from './pages/refer-detail/tab5/tab5.component';
import { ReferListComponent } from './pages/refer/refer-list/refer-list.component';
import { AdduserComponent } from './pages/adduser/adduser.component';
import { ListuserComponent } from './pages/listuser/listuser.component';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { ForgotComponent } from './forgot/forgot.component';
import { MapsComponent } from './pages/refer-detail/maps/maps.component';
import { AmbulanceComponent } from './ambulance/ambulance.component';



@NgModule({
  declarations: [
    ThaiDatePipe,
    TimeAgoPipe,
    AgePipe,
    FilterPipe,
    Nl2BrPipe,
    UniquePipe,
    SortByPipe,
    DragDirective,
    AppComponent,
    LoginComponent,
    PageNotFoundComponent,
    ReferComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    MonitorComponent,
    ContentHeaderComponent,
    ReferDetailComponent,
    Tab0Component,
    Tab1Component,
    Tab2Component,
    Tab3Component,
    Tab4Component,
    Tab5Component,
    ReferListComponent,
    AdduserComponent,
    ListuserComponent,
    ChatroomComponent,
    ForgotComponent,
    MapsComponent,
    AmbulanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB1vV_SqSgax_DloOSolMbMaV08s0vhOm0',
      language: 'th'
    }),
    AgmDirectionModule,
    MyDateRangePickerModule,
    MyDatePickerModule,
    NgxQRCodeModule,
    NgxLinkifyjsModule.forRoot()
  ],
  providers: [
    GoogleMapsAPIWrapper,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
    { provide: 'apiUrl', useValue: environment.apiUrl },
    { provide: 'SECRET_KEY', useValue: environment.SECRET_KEY },
    { provide: 'TOKENNAME', useValue: environment.tokenName },
    { provide: 'SYSTEMNAME', useValue: environment.systemName },
    { provide: 'RERFERPATH', useValue: environment.pathRoute },
    { provide: 'REFER_HOSPCODE', useValue: environment.monit_hospcode },
    { provide: 'REFER_TOKEN', useValue: environment.monit_token },
    { provide: 'REFER_TYPE', useValue: environment.monit_referType },
    { provide: 'SOCKET_NAME', useValue: environment.socket_connect_name }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
