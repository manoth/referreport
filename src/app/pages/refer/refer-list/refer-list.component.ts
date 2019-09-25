import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-refer-list',
  templateUrl: './refer-list.component.html',
  styleUrls: ['./refer-list.component.scss']
})
export class ReferListComponent implements OnInit {
  @Input() lists?: any;
  @Input() path?: string;
  @Input() search?: string;
  @Output() tokenNo: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  toDetail(token_no: string) {
    this.tokenNo.emit(token_no);
  }

  replaceHospname(hospname: string) {
    return hospname.replace('โรงพยาบาล', 'รพ.').replace('ส่งเสริมสุขภาพตําบล', 'สต.').replace('เฉลิมพระเกียรติ', 'ฯ');
  }

}
