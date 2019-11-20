import { Component, OnInit, Input, Output, EventEmitter, Inject, ViewChild } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.component.html',
  styleUrls: ['./tab5.component.scss']
})
export class Tab5Component implements OnInit {

  @ViewChild('scrollMe', { static: false }) scrollMe: any;

  idNonRead: any;
  liading: boolean = true;

  @Input() detail: any;
  @Input() referNo: string;
  @Input() toDiscussion: any;
  @Input() socket: any;
  arrHospcode: Array<any> = [];
  arrUser: Array<any>;
  userOnline: any;
  messenger: any = [];
  message: string;
  decoded: any;
  distination: string;

  constructor(
    private main: MainService
  ) { }

  ngOnChanges(): void {
    this.onOverRead();
    this.main.socket().on('new-comment-' + this.referNo, (msg: any) => {
      this.liading = false;
      if (!msg.type) {
        if (this.decoded.username != msg.msg.username) {
          this.idNonRead = (this.idNonRead) ? this.idNonRead + ',' + msg.msg.id : msg.msg.id.toString();
        }
        this.messenger.unshift(msg.msg);
      } else {
        this.getMessage(msg.type);
      }
    });
    this.getMessage(false);
  }

  ngAfterViewInit() {
    this.getOnline();
  }

  ngOnInit() {
    this.main.arrUser.subscribe((user: any) => {
      if (!this.main.in_array(user.username.username, this.arrUser) && this.userOnline) {
        this.arrUser.push(user.username.username);
        this.userOnline.push(user.username);
      }
      if (!user.on) {
        let arrUser = this.arrUser;
        let userOnline = this.userOnline;
        this.arrUser = [];
        this.userOnline = [];
        for (let i = 0; i < arrUser.length; i++) {
          if (arrUser[i] != user.username.username) {
            this.arrUser.push(arrUser[i]);
            this.userOnline.push(userOnline[i]);
          }
        }
      }
    });
    this.decoded = this.main.decodeToken();
  }

  getOnline() {
    this.arrUser = [];
    this.arrHospcode = [this.detail.from_hospcode, this.detail.refer_hospcode];
    this.main.post('chat/useronline', {}).then((rows: any) => {
      if (rows.ok) {
        this.userOnline = rows.data;
        for (let i = 0; i < this.userOnline.length; i++) {
          this.arrUser.push(this.userOnline[i].username);
        }
      }
    });
  }

  getMessage(read: boolean) {
    this.main.get(`comment/${this.referNo}`).then((rows: any) => {
      this.liading = false;
      if (rows.ok) {
        this.distination = rows.distination[0].hospcode;
        this.idNonRead = rows.idnonread[0].idnonread;
        if (!read) {
          this.messenger = rows.data;
        } else {
          for (let i = 0; i < rows.data.length; i++) {
            if (rows.data[i].hospcode == this.decoded.hospcode) {
              this.messenger[i].read = rows.data[i].read;
            }
          }
        }
      }
    });
  }

  onSend(event?: any) {
    if (event)
      event.preventDefault();
    if (this.message && this.message.trim()) {
      let data: any = {
        refer_no: this.referNo,
        comment: this.message.trim(),
        distination: this.distination
      }
      this.main.post('comment', data).then((res: any) => {
        this.message = null;
      });
    }
  }

  pasteImage(even: any) {
    const items = even.clipboardData.items;
    for (var i = 0; i < items.length; i++) {
      if (items[i].getAsFile()) {
        this.onSendImage(even.clipboardData.files)
      }
    }
  }

  onSendImage(files: any) {
    // console.log(files[0]);
    if (files.length > 0) {
      const formData: FormData = new FormData();
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        if (mimeType != 'application/dicom') {
          alert('ประเภทไฟล์ที่เลือกไม่ถูกต้อง!');
          return;
        } else {
          this.onSendFile(files);
        }
      } else {
        this.liading = true;
        const image = files[0];
        formData.append('image', image);
        formData.append('refer_no', this.referNo);
        formData.append('distination', this.distination);
        this.main.post('upload/images/comment', formData).then((res: any) => {
          this.message = null;
          this.liading = false;
        });
      }
    }
  }

  onSendFile(files: any) {
    if (files.length > 0) {
      const formData: FormData = new FormData();
      const mimeType = files[0].type;
      if (mimeType != 'application/dicom') {
        alert('ประเภทไฟล์ที่เลือกไม่ถูกต้อง!');
        return;
      } else {
        this.liading = true;
        const file = files[0];
        formData.append('image', file);
        formData.append('refer_no', this.referNo);
        formData.append('distination', this.distination);
        this.main.post('upload/files/comment', formData).then((res: any) => {
          this.message = null;
          this.liading = false;
        });
      }
    }
  }

  @Output() overRead: EventEmitter<any> = new EventEmitter();
  onOverRead() {
    if (this.idNonRead) {
      let data: any = {
        refer_no: this.referNo,
        arrId: this.idNonRead.split(','),
        distination: this.distination
      }
      this.idNonRead = false;
      this.main.post('comment/read', data).then((res: any) => {
        this.overRead.emit();
      });
    }
  }

  statusName(status: any) {
    for (let i = 0; i < this.main.status.length; i++) {
      if (this.main.status[i].key == status) {
        return this.main.status[i].value;
      }
    }
  }

  onlineCustom(userOnline: any) {
    let arrUser = [];
    for (let i = 0; i < userOnline.length; i++) {
      if (userOnline[i].status != '0' && this.main.in_array(userOnline[i].hospcode, this.arrHospcode)) {
        arrUser.push(userOnline[i]);
      }
    }
    return arrUser;
  }

}
