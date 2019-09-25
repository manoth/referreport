import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-refer-detail',
  templateUrl: './refer-detail.component.html',
  styleUrls: ['./refer-detail.component.scss']
})
export class ReferDetailComponent implements OnInit {

  tabComment: boolean = false;;

  loading: boolean = false;
  referId: string;
  detail: any;
  treatment: any;
  drug: any;
  lab: any;
  path: string;
  header: any;
  toBottom: any;

  constructor(
    @Inject('apiUrl') private apiUrl: string,
    @Inject('REFER_TOKEN') private token: string,
    @Inject('SOCKET_NAME') private socketName: string,
    private router: Router,
    private route: ActivatedRoute,
    private main: MainService
  ) {
    this.path = this.route.snapshot.url[0].path;
  }

  ngOnInit() {
    if (this.path == 'referin') {
      this.header = { path: '/' + this.path, name: 'Refer In', icon: 'fa-sign-in', ifdname: true, dname: '...' }
    } else if (this.path == 'referout') {
      this.header = { path: '/' + this.path, name: 'Refer Out', icon: 'fa-sign-out', ifdname: true, dname: '...' }
    } else if (this.path == 'referback') {
      this.header = { path: '/' + this.path, name: 'Refer Back', icon: 'fa-retweet', ifdname: true, dname: '...' }
    }
    this.route.queryParams.subscribe((queryParams) => {
      this.tabComment = (queryParams['tab'] == 'comment');
    });
    this.route.params.subscribe((params) => {
      try {
        this.referId = params.referId;
        this.getReferDetail(this.referId);
        this.getTreatment(this.referId);
        this.getDrug(this.referId);
        this.getLab(this.referId);
        this.main.inputHeader(this.header);
      } catch (err) {
        this.router.navigate(['/' + this.path]);
      }
    });
  }

  // tslint:disable-next-line:variable-name Tab0-Tab1
  async getReferDetail(refer_no: string) {
    const row: any = await this.main.post('refer/detail', { refer_no, path: this.path });
    if (row.ok) {
      if (row.data.length > 0) {
        this.loading = true;
        this.detail = row.data[0];
        this.header.dname = this.detail.pname + this.detail.fname + ' ' + this.detail.lname;
        this.main.inputHeader(this.header);
        this.getNonRead();
        this.main.socket.on(`comment-${this.detail.refer_no}`, (username: any) => {
          this.getNonRead();
        });
      } else {
        this.router.navigate(['/' + this.path]);
      }
    } else {
      this.main.logOut();
    }
  }

  // tslint:disable-next-line:variable-name Tab2
  async getTreatment(refer_no: string) {
    const row: any = await this.main.post('refer/treatment', { refer_no });
    if (row.ok) {
      this.treatment = row.data;
    } else {
      this.main.logOut();
    }
  }

  // tslint:disable-next-line:variable-name Tab3
  async getDrug(refer_no: string) {
    const row: any = await this.main.post('refer/drug', { refer_no });
    if (row.ok) {
      this.drug = row.data;
    } else {
      this.main.logOut();
    }
  }

  // tslint:disable-next-line:variable-name Tab4
  async getLab(refer_no: string) {
    const row: any = await this.main.post('refer/lab', { refer_no });
    // console.log(row);
    if (row.ok) {
      this.lab = row.data;
    } else {
      this.main.logOut();
    }
  }

  doCancel(e) {
    console.log('Cancel');
  }

  async doSave(e) {
    const row: any = await this.main.post('refer/reply', {
      refer_no: this.referId,
      memo: e.memo_destination,
      from_hospcode: e.from_hospcode,
      status: '01'
    });
    if (row.ok) {
      Swal.fire({
        type: 'success',
        text: row.message,
        allowOutsideClick: false
      }).then(() => {
        this.main.socket.emit(this.socketName, { token: localStorage.getItem(this.token), refer_no: this.referId });
        this.router.navigate(['/referin']);
      });
    } else {
      Swal.fire({
        type: 'error',
        text: row.err,
        allowOutsideClick: false
      });
    }
  }

  doResend(e) {
    console.log('Resend');
  }

  onTab(e) {
    this.toBottom = e;
  }

  countAlert: number = 0;

  getNonRead() {
    this.main.post('comment/nonread', { refer_no: this.detail.refer_no }).then((row: any) => {
      this.countAlert = (row.data.idnonread) ? row.data.idnonread.split(',').length : 0;
    });
  }
}
