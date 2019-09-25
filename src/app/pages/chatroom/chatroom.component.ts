import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import 'bootstrap-notify';
declare const $: any;

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  room: string = 'r9refer-chatroom-all';
  liading: boolean = true;
  arrUser: Array<any>;
  idNonRead: any;

  userOnline: any;
  messenger: any;
  message: string;
  decoded: any;

  constructor(
    private router: Router,
    private main: MainService
  ) {
    this.getOnline();
  }

  ngAfterViewInit() {
    this.getMessage();
  }

  ngOnInit() {
    this.main.inputHeader({ path: '/chatroom', name: 'Online Chat', subname: 'R9refer', icon: 'fa-comments', ifdname: false, dname: '' });
    this.main.socket.off('chat-' + this.room);
    this.main.socket.on('chat-' + this.room, (res: any) => {
      this.getMessage();
    });
    this.main.socket.off('r9refer-username-online');
    this.main.socket.on('r9refer-username-online', (username: any) => {
      this.getOnline();
      // this.main.getOnlineNotify(username);
    });
    this.main.eventOver.subscribe(() => {
      if (this.router.routerState.snapshot.url == '/chatroom') {
        this.onOverRead();
      }
    });
    this.decoded = this.main.decodeToken();
  }

  scrollToBottom(): void {
    setTimeout(() => {
      try {
        const myScrollContainer = document.getElementById('scrollChatRoom');
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
    this.main.get(`chat/${this.room}`).then((rows: any) => {
      this.liading = false;
      this.idNonRead = rows.idnonread[0].idnonread;
      this.messenger = rows.data;
      this.scrollToBottom();
    });
  }

  onSend() {
    if (this.message) {
      let data: any = {
        refer_no: this.room,
        comment: this.message
      }
      this.main.post('chat', data).then((res: any) => {
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
        formData.append('refer_no', this.room);
        this.main.post('upload/images/chat', formData).then((res: any) => {
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
        formData.append('refer_no', this.room);
        this.main.post('upload/files/chat', formData).then((res: any) => {
          this.message = null;
          this.liading = false;
        });
      }
    }
  }

  onOverRead() {
    if (this.idNonRead) {
      let data: any = {
        refer_no: this.room,
        arrId: this.idNonRead.split(',')
      }
      this.idNonRead = false;
      this.main.post('chat/read', data).then((res: any) => {
        // console.log(res);
      });
    }
  }

}
