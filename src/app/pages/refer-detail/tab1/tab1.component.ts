import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';

declare const $: any;

@Component({
  selector: 'app-tab1',
  templateUrl: './tab1.component.html',
  styleUrls: ['./tab1.component.scss']
})
export class Tab1Component implements OnInit {
  @Input() tab1?: any;
  @Input() path?: string;

  @Output() cancel: EventEmitter<any> = new EventEmitter();
  @Output() save: EventEmitter<any> = new EventEmitter();
  @Output() resend: EventEmitter<any> = new EventEmitter();

  // memoDestination: string;
  memoHas: boolean = false;
  que = new Que();

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
    this.que.refer_no = this.tab1.refer_no;
  }

  doCancel() {
    this.cancel.emit(null);
  }

  doSave() {
    if (this.tab1.memo_destination) {
      this.save.emit(this.tab1);
    } else {
      this.memoHas = true;
      Swal.fire({
        type: 'warning',
        text: 'กรุณากรอกข้อมูล Memo ปลายทาง!',
        allowOutsideClick: false
      }).then((resuil) => {
        $('#memoDestination').focus();
      });
    }
  }

  doResend() {
    this.resend.emit(null);
  }

  onMemo() {
    if (this.tab1.memo_destination) {
      this.memoHas = false;
    } else {
      this.memoHas = true;
    }
  }

  doSaveQuality() {
    if (
      this.que.que1
      && this.que.que2
      && this.que.que3
      && this.que.que4
      && this.que.que5
      && this.que.que6
      && this.que.que7
      && this.que.que8
      && this.que.que9
    ) {
      this.main.post('refer/quality', this.que).then((res: any) => {
        if (res.ok) {
          Swal.fire({
            type: 'success',
            text: 'บันทึกการประเมินคุณภาพสำเร็จแล้ว!',
            allowOutsideClick: false
          }).then((resull) => {
            $('#modal-evaluation').modal('hide');
          });
        } else {
          Swal.fire({
            type: 'error',
            title: 'เกิดข้อผิดพลาด',
            text: res.err,
            allowOutsideClick: false
          });
        }
      });
    } else {
      Swal.fire({
        type: 'warning',
        text: 'กรุณาเลือกแบบประเมินให้ครบด้วย!',
        allowOutsideClick: false
      });
    }
  }

  getQuality(refer_no: string) {
    this.main.get('refer/quality/' + refer_no).then((row: any) => {
      if (row.ok) {
        this.que.que1 = row.data.que1;
        this.que.txtQue1 = row.data.txtQue1;
        this.que.que2 = row.data.que2;
        this.que.txtQue2 = row.data.txtQue2;
        this.que.que3 = row.data.que3;
        this.que.txtQue3 = row.data.txtQue3;
        this.que.que4 = row.data.que4;
        this.que.txtQue4 = row.data.txtQue4;
        this.que.que5 = row.data.que5;
        this.que.txtQue5 = row.data.txtQue5;
        this.que.que6 = row.data.que6;
        this.que.txtQue6 = row.data.txtQue6;
        this.que.que7 = row.data.que7;
        this.que.txtQue7 = row.data.txtQue7;
        this.que.que8 = row.data.que8;
        this.que.txtQue8 = row.data.txtQue8;
        this.que.que9 = row.data.que9;
        this.que.txtQue9 = row.data.txtQue9;
        this.que.issue = row.data.issue;
        this.que.solutions = row.data.solutions;
      }
    });
  }

}

export class Que {
  refer_no: string;
  que1: string;
  txtQue1: string;
  que2: string;
  txtQue2: string;
  que3: string;
  txtQue3: string;
  que4: string;
  txtQue4: string;
  que5: string;
  txtQue5: string;
  que6: string;
  txtQue6: string;
  que7: string;
  txtQue7: string;
  que8: string;
  txtQue8: string;
  que9: string;
  txtQue9: string;
  issue: string;
  solutions: string;
}
