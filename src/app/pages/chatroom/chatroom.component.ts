import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {

  @ViewChild('scrollMe', { static: false }) scrollMe: any;
  // @ViewChild('localVideo', { static: false }) localVideo: ElementRef;

  room: string = 'r9refer-chatroom-all';
  liading: boolean = true;
  arrUser: Array<any>;
  idNonRead: any;

  userOnline: any;
  messenger: any = [];
  message: string;
  decoded: any;


  constructor(
    private router: Router,
    private main: MainService
  ) { }

  ngAfterViewInit() {
    this.getMessage(false);
    this.getOnline();
  }

  ngOnInit() {
    this.decoded = this.main.decodeToken();
    this.main.inputHeader({ path: '/chatroom', name: 'Online Chat', subname: 'R9refer', icon: 'fa-comments', ifdname: false, dname: '' });
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
    this.main.eventOver.subscribe(() => {
      if (this.router.routerState.snapshot.url == '/chatroom') {
        this.onOverRead();
      }
    });
    this.main.socket().on('new-chat-' + this.room, (msg: any) => {
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

    // navigator.mediaDevices.getUserMedia({
    //   audio: true,
    //   video: true
    // }).then(stream => this.localVideo.nativeElement.srcObject = stream).catch(function (e) {
    //   alert('getUserMedia() error: ' + e.name);
    // });
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

  getMessage(read: boolean) {
    this.main.get(`chat/${this.room}`).then((rows: any) => {
      this.liading = false;
      if (rows.ok) {
        this.idNonRead = rows.idnonread[0].idnonread;
        if (!read) {
          this.messenger = rows.data;
        } else {
          for (let i = 0; i < rows.data.length; i++) {
            if (rows.data[i].username == this.decoded.username) {
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
        refer_no: this.room,
        comment: this.message.trim()
      }
      this.main.post('chat', data).then((res: any) => {
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
      if (userOnline[i].status != '0' || this.decoded.status >= '4') {
        arrUser.push(userOnline[i]);
      }
    }
    return arrUser;
  }

}
