import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

declare const $: any;
@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.component.html',
  styleUrls: ['./tab5.component.scss']
})
export class Tab5Component implements OnInit {

  idNonRead: any;
  liading: boolean = true;

  @Input() referNo: string;
  @Input() toBottom: any;
  arrUser: Array<any>;
  userOnline: any;
  messenger: any;
  message: string;
  decoded: any;

  ngOnChanges(): void {
    this.onOverRead();
    this.scrollToBottom();
  }

  constructor(
    private main: MainService
  ) {
    this.getOnline();
  }

  ngAfterViewInit() {
    this.getMessage();
  }

  ngOnInit() {
    this.main.socket.off('comment-' + this.referNo);
    this.main.socket.on('comment-' + this.referNo, (res: any) => {
      this.getMessage();
    });
    this.main.socket.off('r9refer-username-online');
    this.main.socket.on('r9refer-username-online', (username: any) => {
      this.getOnline();
      // this.main.getOnlineNotify(username);
    });
    this.decoded = this.main.decodeToken();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        const myScrollContainer = document.getElementById('scrollMe');
        myScrollContainer.scrollTop = myScrollContainer.scrollHeight;
      } catch (err) {
        // console.log(err);
      }
    }, 200);
  }

  getOnline() {
    this.arrUser = [];
    this.main.post('chat/useronline', {}).then((rows: any) => {
      if (rows.ok) {
        this.userOnline = rows.data;
        for (let i = 0; i < this.userOnline.length; i++) {
          this.arrUser.push(this.userOnline[i].username);
        }
      }
    });
  }

  getMessage() {
    this.main.get(`comment/${this.referNo}`).then((rows: any) => {
      this.liading = false;
      if (rows.ok) {
        this.idNonRead = rows.idnonread[0].idnonread;
        this.messenger = rows.data;
        this.scrollToBottom();
      }
    });
  }

  onSend() {
    if (this.message) {
      let data: any = {
        refer_no: this.referNo,
        comment: this.message
      }
      this.main.post('comment', data).then((res: any) => {
        this.message = null;
      });
    }
  }

  onSendImage(files: any) {
    if (files.length > 0) {
      const formData: FormData = new FormData();
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        alert('ประเภทไฟล์ที่เลือกไม่ถูกต้อง!');
        return;
      } else {
        this.liading = true;
        const image = files[0];
        formData.append('image', image);
        formData.append('refer_no', this.referNo);
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
        arrId: this.idNonRead.split(',')
      }
      this.idNonRead = false;
      this.main.post('comment/read', data).then((res: any) => {
        this.overRead.emit();
      });
    }
  }

}
