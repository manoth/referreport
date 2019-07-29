import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from 'src/app/services/crypto.service';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-refer-in-detail',
  templateUrl: './refer-in-detail.component.html',
  styleUrls: ['./refer-in-detail.component.scss']
})
export class ReferInDetailComponent implements OnInit {

  detail: any;

  constructor(
    private route: ActivatedRoute,
    private crypto: CryptoService,
    private main: MainService
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      try {
        const base64 = this.crypto.atou(params['referId']);
        const referId = this.crypto.decrypt(base64);
        console.log(referId);
        this.getReferinDetail(referId);
        this.main.inputHeader({ path: '/referin', name: 'Refer In', ifdname: true, dname: '...' });
      } catch (err) {
        console.log(err);
      }
    });
  }

  async getReferinDetail(refer_no: string) {
    const row: any = await this.main.post('referin/detail', { refer_no });
    console.log(row);
    if (row.ok) {
      this.detail = row.data[0];
      const name: string = this.detail.pname + this.detail.fname + ' ' + this.detail.lname;
      this.main.inputHeader({ path: '/referin', name: 'Refer In', icon: 'fa-sign-in', ifdname: true, dname: name });
    }
  }

}
