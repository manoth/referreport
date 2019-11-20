import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from '../services/main.service';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  forgot = new Forgot();
  user: any;
  hasCid: boolean = false;
  errCidMessage: string = 'เลขประจำตัวประชาชนไม่ถูกต้อง!';
  loading: boolean = false;
  otpDate: any = { minutes: '00', seconds: '00' };
  interval: any;

  constructor(
    @Inject('TOKENNAME') private tokenName: string,
    private router: Router,
    private main: MainService
  ) { }

  ngOnInit() {
    document.body.className = 'hold-transition login-page';
  }

  dateCount(date: any, count: any) {
    this.interval = setInterval(() => {
      const distance = ((new Date(date).getTime() + (1000 * 60 * count)) - new Date().getTime());
      this.otpDate.minutes = ('0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).substr(-2);
      this.otpDate.seconds = ('0' + Math.floor((distance % (1000 * 60)) / 1000)).substr(-2);
      if (this.otpDate.minutes == '00' && this.otpDate.seconds == '00') {
        this.otpDate.minutes = '00';
        this.otpDate.seconds = '00';
        clearInterval(this.interval);
        Swal.fire({
          type: 'error',
          title: 'เสียใจด้วย!',
          text: 'คุณหมดเวลาในการทำรายการแล้ว กรุณาทำรายการใหม่.',
          allowOutsideClick: false
        }).then((result) => {
          if (result.value) {
            $('#modal-otp').modal('hide');
          }
        });
      }
    }, 1000);
  }

  sendForgot() {
    if (this.checkCID(this.forgot.cid)) {
      this.loading = true;
      this.hasCid = false;
      this.main.post('login/forgot', this.forgot).then((row: any) => {
        this.loading = false;
        this.forgot.otp = '';
        if (row.ok) {
          this.otpDate = { minutes: row.count, seconds: '00' };
          this.dateCount(row.user.otp_update, row.count);
          $('#modal-otp').modal({ backdrop: 'static', keyboard: false });
          this.user = row.user;
          this.forgot.id_otp = row.user.id_otp;
        } else {
          this.hasCid = true;
          this.errCidMessage = row.err;
        }
      });
    } else {
      this.hasCid = true;
    }
  }

  checkCID(cid: string) {
    if (cid && cid.length == 13) {
      let sum = 0;
      for (let i = 0; i < 12; i++) { sum += parseFloat(cid.charAt(i)) * (13 - i); }
      return ((11 - sum % 11) % 10 != parseFloat(cid.charAt(12))) ? false : true;
    } else {
      return false;
    }
  }

  login() {
    if (this.forgot.otp) {
      this.main.post('login/otp', this.forgot).then((res: any) => {
        if (res.ok) {
          clearInterval(this.interval);
          Swal.fire({
            type: 'success',
            title: 'รหัส OTP ถูกต้อง',
            text: 'กรุณาตั้งค่ารหัสผ่านใหม่!',
            allowOutsideClick: false
          }).then((result) => {
            if (result.value) {
              $('#modal-otp').modal('hide');
              localStorage.setItem(this.tokenName, res.token);
              this.main.socket().connect();
              this.router.navigate(['/editprofile']);
            }
          });
        } else {
          Swal.fire({
            type: 'error',
            text: res.err,
            allowOutsideClick: false
          });
        }
      });
    } else {
      Swal.fire({
        type: 'info',
        text: 'กรุณากรอกรหัส OTP ด้วย',
        allowOutsideClick: false
      });
    }
  }

  clearDateCount() {
    clearInterval(this.interval);
  }

}

export class Forgot {
  cid: string;
  id_otp: string;
  otp: string;
}