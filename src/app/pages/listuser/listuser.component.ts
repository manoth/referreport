import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';
import { CryptoService } from 'src/app/services/crypto.service';
import Swal from 'sweetalert2';
import 'bootstrap-notify';
declare const $: any;

@Component({
  selector: 'app-listuser',
  templateUrl: './listuser.component.html',
  styleUrls: ['./listuser.component.scss']
})
export class ListuserComponent implements OnInit {

  list: any;
  decoded: any;
  search: string = '';
  userLoading: boolean = true;

  ngAfterViewInit() {
    $(() => { $('.select2').select2() });
    $('#search').on('change', (event) => {
      this.search = event.target.value;
    });
  }

  constructor(
    private main: MainService,
    private crypto: CryptoService
  ) { }

  ngOnInit() {
    this.main.inputHeader({ path: '/listuser', name: 'รายชื่อผู้ใช้ในหน่วยงาน', icon: 'fa-list-alt', ifdname: false, dname: '' });
    this.getListuser();
    this.decoded = this.main.decodeToken();
    // this.search = (this.decoded.status == '2') ? this.decoded.hospname : '';
  }

  getListuser() {
    this.main.get('adduser/list').then((rows: any) => {
      if (rows.ok) {
        this.userLoading = false;
        this.list = rows.datas;
      }
    });
  }

  encryp(str: string) {
    return this.crypto.utoa(str);
  }

  delUser(cid: string, username: string, name: string) {
    Swal.fire({
      type: 'question',
      title: 'คุณมั่นใจที่จะลบข้อมูล',
      text: 'ของ ' + name + ' ใช่หรือไม่?',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',
      cancelButtonText: 'ไม่ใช่',
      allowOutsideClick: false
    }).then((result) => {
      if (result.value) {
        this.main.post('adduser/del', { cid, username, hospcode: this.decoded }).then((rows: any) => {
          if (rows.ok) {
            Swal.fire({
              position: 'top-end',
              type: 'success',
              title: rows.message,
              showConfirmButton: false,
              timer: 1500,
              allowOutsideClick: false
            }).then(() => {
              this.getListuser();
            });
          } else {
            Swal.fire({
              type: 'error',
              text: rows.err,
              allowOutsideClick: false
            });
          }
        });
      }
    });
  }

  status(str: string) {
    let status;
    if (str == '1') {
      status = 'User';
    } else if (str == '2') {
      status = 'Admin';
    } else if (str == '3') {
      status = 'Developer';
    } else {
      status = 'Register';
    }
    return status;
  }

  changeStatus(active, username) {
    let data = { username: username, active: (active) ? '1' : '0' }
    this.main.post('adduser', { data: data, edit: true }).then((row: any) => {
      let status = (active) ? '"On"' : '"Off"';
      let icon = (active) ? '<i class="fa fa-check-circle-o" aria-hidden="true"></i>' : '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>';
      $.notify(icon + ' เปลี่ยนสถานะการใข้งานของ "' + username + '" เป็น ' + status + ' เรียบน้อยแล้ว!', {
        type: (active) ? 'info' : 'danger'
      });
    });
  }

}
