import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { MainService } from './main.service'

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService {

  constructor(
    private main: MainService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err) {
        this.main.logOut();
        location.reload(true);
      }
      const error = err.error.message || err.statusText;
      return throwError(error);
    }))
  }

}
