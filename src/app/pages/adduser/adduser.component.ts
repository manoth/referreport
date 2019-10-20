import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { CryptoService } from 'src/app/services/crypto.service';

import { IMyDpOptions } from 'mydatepicker';
import Swal from 'sweetalert2';
declare const $: any;

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  myDatePickerOptions: IMyDpOptions;
  path: string;
  pname: string;
  decode: any;
  editProfile: boolean = false;

  user = new User();
  prename: any;
  position: any;
  hospcode: any;
  username: string;
  cid: string;

  imgURL: any;
  image: File = null;
  password: string;
  repassword: string;
  birth: any;

  hasUser: boolean = false;
  txtErrUser: string;
  hasPassword: boolean = false;
  txtErrPassword: string;
  hasRePassword: boolean = false;
  hasCid: boolean = false;
  txtErrCid: string;
  hasPname: boolean = false;
  hasFname: boolean = false;
  hasLname: boolean = false;
  hasEmail: boolean = false;
  hasTel: boolean = false;
  hasBirth: boolean = false;
  hasPosition: boolean = false;
  hasImage: boolean = true;

  userLoading: boolean = false;

  ngAfterViewInit() {
    $('#inputPname').on('change', (event) => {
      this.user.pname = event.target.value;
      this.onPname(this.user.pname);
    });
    $('#inputPosition').on('change', (event) => {
      this.user.position = event.target.value;
      this.onPosition(this.user.position);
    });
    $('#inputHospcode').on('change', (event) => {
      this.user.hospcode = event.target.value;
    });
  }

  constructor(
    @Inject('TOKENNAME') private tokenName: string,
    private router: Router,
    private route: ActivatedRoute,
    private main: MainService,
    private crypto: CryptoService
  ) {
    $(() => { $('.select2').select2() });
    this.decode = this.main.decodeToken();
    const d = new Date();
    this.myDatePickerOptions = {
      satHighlight: true,
      showClearDateBtn: false,
      editableDateField: false,
      openSelectorOnInputClick: true,
      disableSince: { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
    };
  }

  ngOnInit() {
    this.imgURL = './assets/img/profile-avatar-user-' + this.user.sex + '.png';
    this.path = this.route.snapshot.url[0].path
    this.main.inputHeader({ path: '/adduser', name: 'เพิ่มบัญชีผู้ใช้', icon: 'fa-user-plus', ifdname: false, dname: '' });
    this.route.params.subscribe((params) => {
      try {
        if (this.path == 'editprofile') {
          const username = (params['username']) ? this.crypto.atou(params['username']) : this.decode.username;
          this.getUser(username);
        }
      } catch (err) {
        this.router.navigate(['/adduser']);
      }
    });
    this.getPrename();
    this.getPosition();
    this.getHospcode();
  }

  resetButton() {
    this.hasUser = false;
    this.hasPassword = false;
    this.hasRePassword = false;
    this.hasCid = false;
    this.hasPname = false;
    this.hasFname = false;
    this.hasLname = false;
    this.hasEmail = false;
    this.hasTel = false;
    this.hasBirth = false;
    this.hasPosition = false;
    this.hasImage = true;
    return (this.editProfile) ? this.getUser(this.user.username) : null;
  }

  getUser(username: string) {
    this.userLoading = true;
    this.main.post('adduser/username', { username }).then((row: any) => {
      this.editProfile = row.okget;
      if (row.okget) {
        if (this.decode.status > row.data[0].status || this.decode.username == row.data[0].username) {
          this.main.inputHeader({
            path: '/editprofile', name: 'แก้ไขบัญชีผู้ใช้', icon: 'fa-pencil-square-o',
            ifdname: true, dname: row.data[0].prename + row.data[0].fname + ' ' + row.data[0].lname
          });
          this.cid = row.data[0].cid;
          this.username = row.data[0].username;
          this.pname = row.data[0].prename;
          this.user.cid = row.data[0].cid;
          this.user.username = row.data[0].username;
          this.user.pname = row.data[0].pname;
          this.user.fname = row.data[0].fname;
          this.user.lname = row.data[0].lname;
          this.user.hospcode = row.data[0].hospcode;
          // this.user.birth = row.data[0].birth;
          const df: any = new Date(row.data[0].birth);
          this.birth = { date: { year: df.getFullYear(), month: df.getMonth() + 1, day: df.getDate() } }
          this.user.position = row.data[0].position;
          this.user.email = row.data[0].email;
          this.user.tel = row.data[0].tel;
          this.user.sex = row.data[0].sex;
          this.user.image = row.data[0].image;
          this.imgURL = row.data[0].image || './assets/img/profile-avatar-user-' + this.user.sex + '.png';
          this.user.status = row.data[0].status;
          this.user.staff = row.data[0].staff;
          this.user.linetoken = row.data[0].linetoken;
          this.user.active = row.data[0].active;

          this.userLoading = false;
        } else {
          this.router.navigate(['/adduser']);
        }
      } else {
        this.main.logOut();
      }
    });
  }

  fileProgress(files: any) {
    this.image = null;
    this.imgURL = this.user.image || './assets/img/profile-avatar-user-' + this.user.sex + '.png';
    if (files.length > 0) {
      const mimeType = files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      } else {
        this.image = files[0];
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = (_event) => {
          this.imgURL = reader.result;
        }
      }
    }
  }

  getPrename() {
    this.main.get('adduser/prename').then((rows: any) => {
      if (rows.ok) {
        this.prename = rows.datas;
      }
    });
  }

  getPosition() {
    this.main.get('adduser/position').then((rows: any) => {
      if (rows.ok) {
        this.position = rows.datas;
      }
    });
  }

  getHospcode() {
    this.main.get('adduser/hospcode').then((rows: any) => {
      if (rows.ok) {
        this.hospcode = rows.datas;
      }
    });
  }

  async onSubmit() {
    if (
      !this.onUsername(this.user.username)
      && !this.onCid(this.user.cid)
      && !this.onPname(this.user.pname)
      && !this.onFname(this.user.fname)
      && !this.onLname(this.user.lname)
      && !this.onBirth(this.birth)
      && !this.onPosition(this.user.position)
      && !this.onEmail(this.user.email)
      && !this.onTel(this.user.tel)
      && !this.onPassword(this.password)
      && !this.onRePassword(this.repassword)
    ) {
      // console.log('ok');
      if (this.image) {
        const formData: FormData = new FormData();
        formData.append('image', this.image);
        formData.append('cid', this.user.cid);
        const row: any = await this.main.post('upload/avatar2', formData);
        this.user.image = row.image;
        this.hasImage = row.ok;
      }
      if (this.hasImage) {
        this.user.hospcode = (this.user.hospcode || this.decode.hospcode);
        this.user.staff = (this.user.staff || this.decode.cid);
        (this.password) ? (this.user.password = this.crypto.md5(this.password)) : (delete this.user.password);
        this.user.birth = this.birth.date.year + '/' + this.birth.date.month + '/' + this.birth.date.day;
        // console.log(this.user.password);
        await this.main.post('adduser', { data: this.user, edit: this.editProfile }).then((rows: any) => {
          if (rows.ok) {
            const title = (this.editProfile) ? 'แก้ไขข้อมูลบัญชีผู้ใช้สำเร็จ!' : 'บันทึกบัญชีผู้ใช้สำเร็จ!';
            if (this.editProfile) {
              if (rows.oktoken) {
                localStorage.setItem(this.tokenName, rows.token);
                this.main.decodeToken();
              }
              Swal.fire({
                position: 'top-end',
                type: 'success',
                title: title,
                showConfirmButton: false,
                timer: 1500,
                allowOutsideClick: false
              }).then(() => {
                this.router.navigate(['/listuser']);
              });
            } else {
              if (this.decode.status > '1') {
                Swal.fire({
                  type: 'success',
                  title: title,
                  text: 'คุณต้องการที่จะเพิ่มบัญชีผู้ใช้ ภายในหน่วยงานของคุณอีกหรือไหม?',
                  showCancelButton: true,
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33',
                  confirmButtonText: 'ต้องการ',
                  cancelButtonText: 'ไม่ต้องการ',
                  allowOutsideClick: false
                }).then((result) => {
                  if (!result.value) {
                    this.router.navigate(['/listuser']);
                  } else {
                    $('#reset').click();
                    this.user.hospcode = '';
                    this.user.pname = '';
                    this.user.position = '';
                    this.imgURL = './assets/img/profile-avatar-user-' + this.user.sex + '.png';
                  }
                });
              } else {
                Swal.fire({
                  position: 'top-end',
                  type: 'success',
                  title: 'คุณลงทะเบียนเข้าใช้ระบบ R9Refer เรียบร้อยแล้ว!',
                  showConfirmButton: false,
                  timer: 1500,
                  allowOutsideClick: false
                }).then(() => {
                  this.main.logOut();
                });
              }
            }
          } else {
            Swal.fire({
              type: 'error',
              text: rows.err,
              allowOutsideClick: false
            });
          }
        });
      } else {
        Swal.fire({
          type: 'error',
          text: 'รูปภาพที่ Upload ไม่รองรับกับระบบ กรุณาตรวจสอบหรือเปลี่ยนรูปภาพใหม่!',
          allowOutsideClick: false
        });
      }
    }
  }

  onUsername(username: any) {
    if (!this.editProfile) {
      if (username && !(/([^a-zA-Z0-9])/).test(username)) {
        if (username.toString().length >= 3 && !(username * 1 > 0) && username != 0) {
          this.main.post('adduser/username', { username }).then((row: any) => {
            this.hasUser = !row.ok;
            this.txtErrUser = '*บัญชีผู้ใช้นี้ มีผู้ใช้งานในระบบแล้ว!'
          });
        } else {
          this.hasUser = true;
          this.txtErrUser = this.txtNull(username, '*บัญชีผู้ใช้ต้องมี a-zA-Z และมีความยาวอย่างน้อย 3 ตัวอักษรขึ้นไป!');
        }
      } else {
        this.hasUser = true;
        this.txtErrUser = this.txtNull(username, '*ป้อนได้เฉพาะ a-z,A-Z และ 0-9 เท่านั้น!');
      }
    }
    return this.hasUser;
  }

  onPassword(password: string) {
    if (!this.editProfile || this.password) {
      if (password && (/([a-zA-Z0-9!%&@#$^*?_~])/).test(password)) {
        if (password != this.user.username) {
          this.txtErrPassword = (password.toString().length < 8) ? 'รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรขึ้นไป' : undefined;
          this.hasPassword = !(!this.txtErrPassword);
          if (this.hasPassword) {
            this.repassword = '';
            this.hasRePassword = false;
          }
        } else {
          this.hasPassword = true;
          this.txtErrPassword = this.txtNull(password, '*รหัสผ่านควรจะแตกต่างจาก บัญชีผู้ใช้!');
        }
      } else {
        this.hasPassword = true;
        this.txtErrPassword = this.txtNull(password, '*รหัสผ่านป้อนได้เฉพาะ a-z,A-Z,0-9 และเครื่องหมายวรรคตอนทั่วไปเท่านั้น กรุณาตรวจสอบภาษาของแป้นพิมพ์');
      }
    } else {
      this.repassword = this.password;
      this.hasPassword = false;
      this.hasRePassword = false;
    }
    return this.hasPassword;
  }

  onRePassword(str: string) {
    return this.hasRePassword = (str != this.password) ? true : false;
  }

  onCid(cid: string) {
    if (!this.editProfile) {
      if (cid && this.checkCID(cid.toString())) {
        this.main.post('adduser/cid', { cid }).then((row: any) => {
          this.hasCid = !row.ok;
          this.txtErrCid = '*รหัสประชาชนนี้ มีผู้ใช้งานในระบบแล้ว!'
        });
      } else {
        this.hasCid = true;
        this.txtErrCid = this.txtNull(cid, '*รหัสประชาชนไม่ถูกต้อง!');
      }
    }
    return this.hasCid;
  }

  onPname(str: string) {
    return this.hasPname = (!str) ? true : false;
  }

  onFname(str: string) {
    return this.hasFname = (!str) ? true : false;
  }

  onLname(str: string) {
    return this.hasLname = (!str) ? true : false;
  }

  onEmail(str: string) {
    return this.hasEmail = (!(/^([a-zA-Z0-9\_\.\-]+)@([a-zA-Z0-9]+)\.([a-zA-Z0-9\.]{2,5})$/).test(str)) ? true : false;
  }

  onTel(str: string) {
    return this.hasTel = ((/([^0-9])/).test(str) || (str && str.length < 10)) ? true : false;
  }

  onBirth(str: any) {
    return this.hasBirth = (!str) ? true : false;
  }

  onSex(str: any) {
    if (!this.image) {
      this.imgURL = this.user.image || './assets/img/profile-avatar-user-' + str + '.png';
    }
  }

  onPosition(str: string) {
    return this.hasPosition = (!str) ? true : false;
  }

  txtNull(str: string, txt?: string) {
    return (!str) ? '*จำเป็นต้องมีข้อมูล!' : txt;
  }

  checkCID(cid: string) {
    if (cid.length == 13) {
      let sum = 0;
      for (let i = 0; i < 12; i++) { sum += parseFloat(cid.charAt(i)) * (13 - i); }
      return ((11 - sum % 11) % 10 != parseFloat(cid.charAt(12))) ? false : true;
    } else {
      return false;
    }
  }

  userStatus(arr: any, status: any, username: any) {
    let arrStatus = [];
    for (let i = 0; i < arr.length; i++) {
      if (((this.decode.username == username && arr[i].key == status) || arr[i].key < status) && (arr[i].key != '0' || status > 3)) {
        arrStatus.push(arr[i]);
      }
    }
    return arrStatus;
  }

}

export class User {
  cid: string;
  username: string;
  password: string;
  pname: string = '';
  fname: string;
  lname: string;
  hospcode: string = '';
  email: string;
  tel: string;
  sex: string = 'ชาย';
  birth: any;
  position: string = '';
  image: string;
  staff: string;
  status: string = '1';
  linetoken: string;
  active: string = '1';
}
