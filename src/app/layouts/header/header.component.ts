import { Component, OnInit, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { MainService } from 'src/app/services/main.service';
import { CryptoService } from 'src/app/services/crypto.service';
declare const $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() socket: any;
  @Input() user: any;

  room: string = 'r9refer-chatroom-all';
  token = new Token();
  dataToken: any;
  isToken: boolean = false;
  countAlert: number = 0;
  interval: any;
  commentAlert: number = 0;
  commentList: any;

  countReferIn: number = 0;
  arrReferNo: any = [];

  reportList: any;

  constructor(
    @Inject('SYSTEMNAME') private titleName: string,
    @Inject('REFER_TOKEN') private referToken: string,
    @Inject('REFER_HOSPCODE') private hospcode: string,
    private title: Title,
    private router: Router,
    private main: MainService,
    private crypto: CryptoService
  ) { }

  ngOnInit() {
    this.getNonReadChat();
    this.getListCountRefer();
    this.getNonReadComment();
    this.getReport();

    this.main.eventOver.subscribe(() => {
      this.clearCountAlert();
    });
    this.main.getDcodedToken.subscribe((data: any) => {
      this.user = data;
      this.getListCountRefer();
      this.getNonReadComment();
    });
    this.main.countReferIn.subscribe((countReferIn: any) => {
      this.countReferIn = countReferIn;
    });

    this.socket.on('title-comment-' + localStorage.getItem(this.hospcode), (row: any) => {
      if (row && this.user.username != row.username) {
        this.nonReadComment(row);
        const audio = new Audio('./assets/sound/beyond-doubt.mp3');
        audio.play();
      } else {
        this.arrReferNo = [];
        this.commentAlert = 0;
        this.title.setTitle(this.titleName);
      }
    });
    this.socket.on(`title-chat-${this.room}`, (username: any) => {
      (username && this.user.username != username) ? this.titleMessage() : this.countAlert = 0;
    });
  }

  getReport() {
    this.main.get('report/list').then((res: any) => {
      this.reportList = res.data;
    });
  }

  getNonReadChat() {
    this.main.post('chat/nonread', { refer_no: this.room }).then((row: any) => {
      if (row.ok) {
        this.countAlert = (row.data.idnonread) ? row.data.idnonread.split(',').length : 0;
      }
    });
  }

  getNonReadComment() {
    this.main.get('comment').then((row: any) => {
      if (row.ok) {
        this.nonReadComment(row);
      }
    });
  }

  nonReadComment(row: any) {
    this.commentList = row.data;
    this.arrReferNo = (row.count[0].refer_no) ? row.count[0].refer_no.split(',') : [];
    this.commentAlert = (row.count[0].refer_no) ? row.count[0].refer_no.split(',').length : 0;
    if (this.commentAlert > 0) {
      this.title.setTitle(`(${this.commentAlert}) ${this.titleName}`);
    } else {
      this.title.setTitle(this.titleName);
    }
  }

  getListCountRefer(obj?: any) {
    const objDate = (obj) ? obj : { beginDate: null, endDate: null };
    this.main.post('refer/listcount', objDate).then((row: any) => {
      if (row.ok) {
        this.countReferIn = row.list.count;
      }
    });
  }

  titleMessage() {
    this.countAlert += 1;
    const audio = new Audio('./assets/sound/notify.mp3');
    audio.play();
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
    (this.commentAlert <= 0) ?
      this.title.setTitle(this.titleName) :
      this.title.setTitle(`(${this.commentAlert}) ${this.titleName}`);
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
        this.token.line_token_walk_in = row.data[0].line_token_walk_in;
        this.token.line_token_walk_out = row.data[0].line_token_walk_out;
      } else {
        this.onSunmit();
      }
    });
  }

  onSunmit() {
    this.main.post('gentoken', this.token).then((token: any) => {
      if (token.ok) {
        localStorage.setItem(this.referToken, token.res.refer_token);
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
  line_token_walk_in: string;
  line_token_walk_out: string;
}
