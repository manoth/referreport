import { Component, OnInit, Inject } from '@angular/core';
import { MainService } from '../services/main.service';

import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {

  today: any = Date.now();
  referTitle: string;
  chechTypeRefer: boolean = true;

  monit = new Monit();
  hospital: any;
  referIn: any;

  constructor(
    @Inject('REFER_HOSPCODE') private hospcode: string,
    @Inject('REFER_TOKEN') private token: string,
    @Inject('REFER_TYPE') private referType: string,
    private main: MainService
  ) {
    setInterval(() => { this.today = Date.now() }, 1000);
  }

  ngOnInit() {
    this.monit.hospcode = localStorage.getItem(this.hospcode);
    this.monit.token = localStorage.getItem(this.token);
    this.monit.type = localStorage.getItem(this.referType);
    this.doSave(this.monit.hospcode, this.monit.token, this.monit.type);

    const socket = this.main.socketMonit(this.monit.token);
    socket.on(this.monit.token, async (refer_no) => {
      await this.referin();
      await this.switchColor(refer_no);
    });
    socket.on('refer-monitor-reload', (reload) => {
      window.location.reload(true);
    });
  }

  switchColor(refer_no: string) {
    if (!$('tr#bg' + refer_no).hasClass('new-case')) {
      const interval = setInterval(() => {
        $('tr#bg' + refer_no).addClass('new-case');
        if ($('tr#bg' + refer_no).hasClass('bg-cyan')) {
          $('tr#bg' + refer_no).removeClass('bg-cyan');
          $('tr#bg' + refer_no).addClass('bg-black');
        } else {
          $('tr#bg' + refer_no).removeClass('bg-black');
          $('tr#bg' + refer_no).addClass('bg-cyan');
        }
      }, 1000);
      setTimeout(() => {
        $('tr#bg' + refer_no).removeClass('bg-cyan');
        $('tr#bg' + refer_no).addClass('bg-black');
        $('tr#bg' + refer_no).removeClass('new-case');
        clearInterval(interval);
      }, 1000 * 60 * 2);
    }
  }

  doSave(hospcode, token, type) {
    $('#modal-default').modal({ backdrop: 'static', keyboard: false });
    if (hospcode && token && type) {
      this.referTitle = (type == 'in') ? 'Refer In' : 'Refer Out';
      this.chechTypeRefer = (type == 'in') ? true : false;
      this.main.post('monitor', { hospcode, token, type }).then((row: any) => {
        localStorage.setItem(this.hospcode, this.monit.hospcode);
        localStorage.setItem(this.token, this.monit.token);
        localStorage.setItem(this.referType, this.monit.type);
        this.hospital = row.data[0];
        $('#modal-default').modal('hide');
        this.referin();
      }).catch((err: any) => {
        Swal.fire({
          type: 'error',
          title: 'รหัสสถานบริการ หรือ Refer Token ไม่ถูกต้อง!',
          text: err,
          allowOutsideClick: false
        });
        localStorage.removeItem(this.hospcode);
        localStorage.removeItem(this.token);
        localStorage.removeItem(this.referType);
      });
    } else {
      Swal.fire({
        type: 'warning',
        text: 'กรุณากรอกข้อมูลให้ครบทุกช่อง!',
        allowOutsideClick: false
      });
    }
  }

  async referin() {
    const hospcode = localStorage.getItem(this.hospcode);
    const token = localStorage.getItem(this.token);
    const type = localStorage.getItem(this.referType);
    const rows: any = await this.main.post('monitor/referin', { hospcode, token, type });
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
    return hospname.replace('โรงพยาบาล', 'รพ.').replace('ส่งเสริมสุขภาพตําบล', 'สต.');
  }

  goFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

}

export class Monit {
  hospcode: string;
  token: string;
  type: string;
}
