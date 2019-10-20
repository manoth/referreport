import { Component, OnInit, Inject } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  socket: any;
  user: any;

  constructor(
    @Inject('TOKENNAME') private tokenName: string,
    private main: MainService
  ) { }

  ngOnInit() {
    document.body.className = 'hold-transition skin-green layout-top-nav fixed';
    this.user = this.main.decodeToken();
    this.socket = this.main.socket(localStorage.getItem(this.tokenName));
    this.socket.on('r9refer-username-online', (user: any) => {
      // console.log(user);
      this.main.userOnline(user);
      if (user.username == this.user.username && !user.on) {
        this.main.socket(localStorage.getItem(this.tokenName));
      }
    });
  }

}
