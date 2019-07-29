import { Component, OnInit } from '@angular/core';

import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  user: any;

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
    this.user = this.main.decodeToken();
  }

  logOut() {
    this.main.logOut();
  }

}
