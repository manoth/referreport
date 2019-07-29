import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from 'src/app/services/crypto.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-refer-back',
  templateUrl: './refer-back.component.html',
  styleUrls: ['./refer-back.component.scss']
})
export class ReferBackComponent implements OnInit {

  user: any;
  lists: any;

  constructor(
    private router: Router,
    private crypto: CryptoService,
    private main: MainService

  ) { }

  ngOnInit() {
    this.main.inputHeader({ path: '/referback', name: 'Refer Back', icon: 'fa-retweet', ifdname: false, dname: '' });
    this.user = this.main.decodeToken();
    this.getReferinList();
  }

  async getReferinList() {
    const rows: any = await this.main.get('referin/list');
    if (rows.ok) {
      this.lists = rows.datas;
    }
  }

  toDetail(refer_no: string) {
    const aes = this.crypto.encrypt(refer_no);
    const base64 = this.crypto.utoa(aes);
    this.router.navigate(['/referin/' + base64.replace('==', '').replace('=', '')]);
  }

}
