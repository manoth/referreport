import { Component, OnInit } from '@angular/core';
import { MainService } from '../services/main.service';

import * as io from 'socket.io-client';

declare const $: any;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  private socket: SocketIOClient.Socket;

  monit = new Monit();
  hospital: any;
  referIn: any;

  constructor(
    private main: MainService
  ) {
    this.socket = io('http://203.157.182.3:3000');
  }

  ngOnInit() {
    this.monit.hospcode = localStorage.getItem('hospcode');
    this.monit.token = localStorage.getItem('token');
    this.doSave(this.monit.hospcode, this.monit.token);
  }

  doSave(hospcode, token) {
    $('#modal-default').modal({ backdrop: 'static', keyboard: false });
    if (hospcode && token) {
      this.main.post('monitor', { hospcode, token }).then((row: any) => {
        localStorage.setItem('hospcode', this.monit.hospcode);
        localStorage.setItem('token', this.monit.token);
        this.hospital = row.data[0];
        $('#modal-default').modal('hide');
        this.referin();
      }).catch((err: any) => {
        console.log(err);
        localStorage.removeItem('hospcode');
        localStorage.removeItem('token');
      });
    }
  }

  async referin() {
    const hospcode = localStorage.getItem('hospcode');
    const token = localStorage.getItem('token');
    const rows: any = await this.main.post('monitor/referin', { hospcode, token });
    console.log(rows);
    if (rows.ok) {
      this.referIn = rows.data;
      this.socket.on(token, msg => {
        this.referin();
      });
    }
  }

  dateFormat(date: string) {
    return date.slice(0, 10);
  }

}

export class Monit {
  hospcode: string;
  token: string;
}
