import { Component, OnInit, Inject } from '@angular/core';

import { MainService } from 'src/app/services/main.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  room: string = 'r9refer-chatroom-all';
  token = new Token();
  user: any;
  dataToken: any;
  isToken: boolean = false;
  countAlert: number = 0;
  interval: any;

  countReferIn: number = 0;

  constructor(
    @Inject('SYSTEMNAME') private titleName: string,
    @Inject('REFER_TOKEN') private tokenName: string,
    private title: Title,
    private router: Router,
    private main: MainService
  ) { }

  ngOnInit() {
    this.getNonReadChat();
    this.getNonReadComment();
    this.user = this.main.decodeToken();
    this.main.getDcodedToken.subscribe((data: any) => {
      this.user = data;
    });
    this.main.countReferIn.subscribe(() => {
      this.getNonReadComment();
    });
    this.main.eventOver.subscribe(() => {
      this.clearCountAlert();
    });
    this.main.socket.off(`title-chat-${this.room}`);
    this.main.socket.on(`title-chat-${this.room}`, (username: any) => {
      (this.user.username != username && username) ? this.titleMessage() : null;
      this.getNonReadChat();
    });
    // this.main.socket.off('comment-username-online');
    // this.main.socket.on('comment-username-online', (username: any) => {
    //   // this.main.getOnlineNotify(username);
    // });
  }

  getNonReadChat() {
    this.main.post('chat/nonread', { refer_no: this.room }).then((row: any) => {
      this.countAlert = (row.data.idnonread) ? row.data.idnonread.split(',').length : 0;
    });
  }

  getNonReadComment() {
    this.main.post('comment/nonread', { refer_no: this.room }).then((row: any) => {
      this.countReferIn = row.countReferIn[0].count;
    });
  }

  titleMessage() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        if (this.title.getTitle() == this.titleName) {
          this.title.setTitle('ข้อความเข้าในห้อง Online Chat');
        } else {
          this.title.setTitle(this.titleName);
        }
      }, 1000);
    }
  }

  clearCountAlert() {
    clearInterval(this.interval);
    this.interval = null;
    this.title.setTitle(this.titleName);
    if (this.router.routerState.snapshot.url == '/chatroom') {
      this.countAlert = 0;
    }
  }

  logOut() {
    this.main.logOut();
  }

  genToken() {
    this.main.get('gentoken').then((row: any) => {
      this.isToken = row.ok;
      if (row.ok) {
        this.dataToken = row.data[0].refer_token;
        this.token.refer_token = row.data[0].refer_token;
        this.token.line_token_in = row.data[0].line_token_in;
        this.token.line_token_out = row.data[0].line_token_out;
        this.token.line_token_loads_in = row.data[0].line_token_loads_in;
        this.token.line_token_loads_out = row.data[0].line_token_loads_out;
      } else {
        this.onSunmit();
      }
    });
  }

  onSunmit() {
    this.main.post('gentoken', this.token).then((token: any) => {
      if (token.ok) {
        localStorage.setItem(this.tokenName, token.res.refer_token);
        this.dataToken = token.res.refer_token;
      }
    });
  }

  genNewToken() {
    this.main.get('gentoken/new').then((row: any) => {
      if (row.ok) {
        this.dataToken = row.token;
        this.token.refer_token = row.token;
      }
    });
  }

  onCopy(id: string) {
    $('#' + id).focus();
    $('#' + id).select();
    document.execCommand('copy');
  }

}

export class Token {
  hospcode: string;
  refer_token: string;
  line_token_in: string;
  line_token_out: string;
  line_token_loads_in: string;
  line_token_loads_out: string;

}
