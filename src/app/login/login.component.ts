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
    const token = sessionStorage.getItem(this.tokenName);
    try {
      if (!this.jwtHelper.isTokenExpired(token)) {
        this.router.navigate(['list']);
      }
    } catch (err) {
      this.main.logOut();
    }
  }

  ngOnInit() {
    document.body.className = 'hold-transition login-page';
  }

  async login() {
    console.log(this.sign);
  }

}

export class Login {
  username: string;
  password: string;
}