import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

  constructor() { }

  ngOnInit() {
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

}
