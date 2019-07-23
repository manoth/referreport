import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public jwtHelper = new JwtHelperService();

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    @Inject('TOKENNAME') private tokenName: string,
    private router: Router,
    public http: HttpClient
  ) { }

  get(path: string) {
    const url: string = `${this.apiUrl}/${path}`;
    return this.http.get(url).toPromise();
  }

  post(path: string, data: any) {
    const url: string = `${this.apiUrl}/${path}`;
    return this.http.post(url, data).toPromise();
  }

  getUrl(url: string) {
    return this.http.get(url).toPromise();
  }

  postUrl(url: string, data: any) {
    return this.http.post(url, data).toPromise();
  }

  logOut() {
    sessionStorage.removeItem(this.tokenName);
    this.router.navigate(['/login']);
  }

  decodeToken() {
    const token = sessionStorage.getItem(this.tokenName);
    try {
      if (!this.jwtHelper.isTokenExpired(token)) {
        return this.jwtHelper.decodeToken(token);
      } else {
        this.logOut();
        return false;
      }
    } catch (err) {
      this.logOut();
      return false;
    }
  }

}
