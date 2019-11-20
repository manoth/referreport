import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-refer-list',
  templateUrl: './refer-list.component.html',
  styleUrls: ['./refer-list.component.scss']
})
export class ReferListComponent implements OnInit {
  @Input() accept: boolean;
  @Input() lists?: any;
  @Input() path?: string;
  @Input() search?: string;
  @Input() clinic?: string;
  @Input() loads?: string;
  @Output() tokenNo: EventEmitter<any> = new EventEmitter();

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
  }

  toDetail(token_no: string) {
    this.tokenNo.emit(token_no);
  }

  replaceHospname(hospname: string) {
    return hospname.replace('โรงพยาบาล', 'รพ.').replace('ส่งเสริมสุขภาพตําบล', 'สต.').replace('เฉลิมพระเกียรติ', 'ฯ');
  }

  onCancel(l: any) {
    Swal.fire({
      type: 'question',
      title: 'คุณมั่นใจที่จะลบข้อมูลการลงรับ',
      text: 'ข้อมูลผู้ป่วย Refer ' + l.pname + l.fname + ' ' + l.lname + ' ใช่หรือไม่?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.main.post('refer/delReply', l).then((res: any) => {
          Swal.fire({
            position: 'top-end',
            type: 'success',
            title: 'ลบข้อมูลการลงรับเรียบร้อยแล้ว!',
            showConfirmButton: false,
            timer: 1500,
            allowOutsideClick: false
          });
        });
      }
    });
  }

  elementType: 'url' | 'canvas' | 'img' = 'url';
  qrCodeData: string;
  onTracking(url: string) {
    let host = window.location.protocol + '//' + window.location.host + '/ref/ambulance/';
    this.qrCodeData = host + url.replace('==', '').replace('=', '');
  }

}
