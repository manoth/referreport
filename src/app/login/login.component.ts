import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';

import { JwtHelperService } from '@auth0/angular-jwt';
import { MainService } from '../services/main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  jwtHelper = new JwtHelperService();
  sign = new Login();

  constructor(
    @Inject('TOKENNAME') private tokenName: string,
    private router: Router,
    private main: MainService
  ) {
    const token = localStorage.getItem(this.tokenName);
    try {
      if (!this.jwtHelper.isTokenExpired(token)) {
        this.router.navigate(['/referin']);
      }
    } catch (err) {
      this.main.logOut();
    }
  }

  ngOnInit() {
    document.body.className = 'hold-transition login-page';
  }

  async login() {
    if (this.sign.username && this.sign.password) {
      const row: any = await this.main.post('login', this.sign);
      if (row.ok) {
        localStorage.setItem(this.tokenName, row.token);
        this.router.navigate(['/referin']);
      } else {
        // this.sign.username = '';
        // this.sign.password = '';
        Swal.fire({
          type: 'error',
          text: row.data,
          allowOutsideClick: false
        });
      }
    } else {
      Swal.fire({
        type: 'info',
        text: 'กรุณากรอก Username และ Password ด้วย',
        allowOutsideClick: false
      });
    }
  }

}

export class Login {
  username: string;
  password: string;
}