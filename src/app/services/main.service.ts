import { Injectable, Inject, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import * as io from 'socket.io-client';

import 'bootstrap-notify';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class MainService {

  public jwtHelper = new JwtHelperService();
  public getDcodedToken = new EventEmitter();

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    @Inject('TOKENNAME') private tokenName: string,
    @Inject('REFER_HOSPCODE') private hospcode: string,
    @Inject('REFER_TOKEN') private token: string,
    @Inject('REFER_TYPE') private referType: string,
    private router: Router,
    public http: HttpClient
  ) { }

  public socket: SocketIOClient.Socket = io(this.apiUrl);

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
    this.get('logout').then(() => {
      localStorage.removeItem(this.tokenName);
      this.router.navigate(['/login']);
    });
  }

  decodeToken() {
    const token = localStorage.getItem(this.tokenName);
    try {
      if (!this.jwtHelper.isTokenExpired(token)) {
        const decoded = this.jwtHelper.decodeToken(token);
        localStorage.setItem(this.hospcode, decoded.hospcode);
        localStorage.setItem(this.token, decoded.refer_token);
        localStorage.setItem(this.referType, 'in');
        this.getDcodedToken.emit(decoded);
        return decoded;
      } else {
        this.logOut();
        return false;
      }
    } catch (err) {
      this.logOut();
      return false;
    }
  }

  in_array(str: any, array: Array<any>): boolean {
    return array.indexOf(str) >= 0;
  }

  public dataHeader = new EventEmitter();
  inputHeader(data: any) {
    this.dataHeader.emit(data);
  }

  public eventOver = new EventEmitter();
  onOver() {
    this.eventOver.emit();
  }

  public countReferIn = new EventEmitter();
  liatReferIn() {
    this.countReferIn.emit();
  }

  // getOnlineNotify(username: any) {
  //   if (this.decodeToken().username != username.username) {
  //     let message = (username.type == 'success') ?
  //       `<i class="fa fa-user-circle-o" aria-hidden="true"></i> บัญชีผู้ใช้งานชื่อ "${username.username}" กำลังออนไลน์` :
  //       `<i class="fa fa-user-circle-o" aria-hidden="true"></i> บัญชีผู้ใช้งานชื่อ "${username.username}" ออฟไลน์`;
  //     $.notify(message, { type: username.type });
  //   }
  // }

}
