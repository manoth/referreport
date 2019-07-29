import { Component, OnInit, Inject } from '@angular/core';
import { MainService } from '../services/main.service';

import * as io from 'socket.io-client';
import { async } from '@angular/core/testing';

declare const $: any;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  private socket: SocketIOClient.Socket;
  today: any = Date.now();

  monit = new Monit();
  hospital: any;
  referIn: any;

  hospcode: string = 'refer-hospcode';
  token: string = 'refer-token';

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    private main: MainService
  ) {
    this.socket = io(this.apiUrl);
    setInterval(() => { this.today = Date.now() }, 1000);
  }

  ngOnInit() {
    this.monit.hospcode = localStorage.getItem(this.hospcode);
    this.monit.token = localStorage.getItem(this.token);
    this.doSave(this.monit.hospcode, this.monit.token);
    this.socket.on(this.monit.token, async (refer_no) => {
      await this.referin();
      await this.switchColor(refer_no);
    });
  }

  switchColor(refer_no: string) {
    if (!$('tr#bg' + refer_no).hasClass('new-case')) {
      const interval = setInterval(() => {
        $('tr#bg' + refer_no).addClass('new-case');
        if ($('tr#bg' + refer_no).hasClass('bg-cyan')) {
          $('tr#bg' + refer_no).removeClass('bg-cyan');
        } else {
          $('tr#bg' + refer_no).addClass('bg-cyan');
        }
      }, 1000);
      setTimeout(() => {
        $('tr#bg' + refer_no).removeClass('bg-cyan');
        $('tr#bg' + refer_no).removeClass('new-case');
        clearInterval(interval);
      }, 1000 * 60 * 2);
    }
  }

  doSave(hospcode, token) {
    $('#modal-default').modal({ backdrop: 'static', keyboard: false });
    if (hospcode && token) {
      this.main.post('monitor', { hospcode, token }).then((row: any) => {
        localStorage.setItem(this.hospcode, this.monit.hospcode);
        localStorage.setItem(this.token, this.monit.token);
        this.hospital = row.data[0];
        $('#modal-default').modal('hide');
        this.referin();
      }).catch((err: any) => {
        console.log(err);
        localStorage.removeItem(this.hospcode);
        localStorage.removeItem(this.token);
      });
    }
  }

  async referin() {
    const hospcode = localStorage.getItem(this.hospcode);
    const token = localStorage.getItem(this.token);
    const rows: any = await this.main.post('monitor/referin', { hospcode, token });
    console.log(rows);
    if (rows.ok) {
      this.referIn = rows.data;
    }
  }

  dateFormat(date: string) {
    return date.slice(0, 10);
  }

  counterTime(date: string, time: string) {
    const load_time = '0' + time;
    const StratDate = new Date(`${date.slice(0, 11)}${load_time.substr(-5)}:00.000Z`);
    const EndDate = new Date();
    const StratDateTime = StratDate.getTime() - (1000 * 60 * 60 * 7);
    if (StratDateTime < EndDate.getTime()) {
      const diff = EndDate.getTime() - StratDateTime;
      const H = '00' + Math.floor(diff / (1000 * 60 * 60));
      const mm = '00' + Math.floor((diff / (1000 * 60)) % 60);
      const ss = '00' + Math.floor(((diff / 1000) % 60) % 60);
      return `${H.substr(-2)}:${mm.substr(-2)}:${ss.substr(-2)}`;
    } else {
      return '00:00:00';
    }
  }

  replaceHospname(hospname: string) {
    return hospname.replace('โรงพยาบาล', 'รพ.').replace('ส่งเสริมสุขภาพตําบล', 'สต.').replace('เฉลิมพระเกียรติ', 'ฯ');
  }

  goFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  className(refer_no: string) {
    return 'bg-' + refer_no;
  }

}

export class Monit {
  hospcode: string;
  token: string;
}
