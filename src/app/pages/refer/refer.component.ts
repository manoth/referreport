import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// val.year //{{visibleMonth
import { IMyDrpOptions } from 'mydaterangepicker';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-refer-in',
  templateUrl: './refer.component.html',
  styleUrls: ['./refer.component.scss']
})
export class ReferComponent implements OnInit {

  tabId: string;

  myDateRangePickerOptions: IMyDrpOptions;
  model: any;
  beginDate: any;
  endDate: any;
  search: string;

  path: string;
  header: any;
  lists: any;
  accept: boolean = false;
  loading: boolean = true;

  countReferIn: number;

  constructor(
    @Inject('REFER_HOSPCODE') private hospcode: string,
    private route: ActivatedRoute,
    private main: MainService
  ) {
    let d = new Date();
    d.setDate((d.getDate() + 1));
    let disableSince: any = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
    let bd = new Date();
    bd.setDate((bd.getDate() - 1));
    let beginDate: any = { year: bd.getFullYear(), month: bd.getMonth() + 1, day: bd.getDate() }
    let ed = new Date();
    let endDate: any = { year: ed.getFullYear(), month: ed.getMonth() + 1, day: ed.getDate() }
    this.myDateRangePickerOptions = {
      dateFormat: 'dd mmm yyyy',
      dayLabels: { su: 'อา', mo: 'จ', tu: 'อ', we: 'พ', th: 'พฤ', fr: 'ศ', sa: 'ส' },
      monthLabels: { 1: 'ม.ค', 2: 'ก.พ.', 3: 'มี.ค.', 4: 'เม.ย.', 5: 'พ.ค.', 6: 'มิ.ย.', 7: 'ก.ค.', 8: 'ส.ค.', 9: 'ก.ย.', 10: 'ต.ค.', 11: 'พ.ย.', 12: 'ธ.ค.' },
      firstDayOfWeek: 'su',
      sunHighlight: true,
      editableDateRangeField: false,
      inline: false,
      alignSelectorRight: false,
      indicateInvalidDateRange: true,
      openSelectorOnInputClick: true,
      disableSince: disableSince
    };
    this.model = {
      beginDate: beginDate,
      endDate: endDate
    };
    this.beginDate = beginDate.year + '/' + beginDate.month + '/' + beginDate.day;
    this.endDate = endDate.year + '/' + endDate.month + '/' + endDate.day;
    this.path = this.route.snapshot.url[0].path;
    this.route.queryParams.subscribe((queryParams) => {
      this.loading = true;
      this.tabId = queryParams['tab'];
      this.accept = (this.tabId == 'accept') ? true : false;
      this.getReferinList(this.beginDate, this.endDate, this.path, this.accept);
    });
  }

  ngOnInit() {
    this.getNonRead();
    if (this.path == 'referin') {
      this.header = { path: '/' + this.path, name: 'Refer In', icon: 'fa-sign-in', ifdname: false, dname: '' }
    } else if (this.path == 'referout') {
      this.header = { path: '/' + this.path, name: 'Refer Out', icon: 'fa-sign-out', ifdname: false, dname: '' }
    } else if (this.path == 'referback') {
      this.header = { path: '/' + this.path, name: 'Refer Back', icon: 'fa-retweet', ifdname: false, dname: '' }
    }
    this.main.inputHeader(this.header);
    this.main.socket().on(localStorage.getItem(this.hospcode), (refer: any) => {
      // console.log(refer);
      this.getReferinList(this.beginDate, this.endDate, this.path, this.accept);
      this.getNonRead();
    });
  }

  getNonRead() {
    this.main.post('refer/listcount', { beginDate: this.beginDate, endDate: this.endDate }).then((row: any) => {
      if (row.ok) {
        this.countReferIn = row.list.count;
        this.main.listReferIn(this.countReferIn);
      }
    });
  }

  getReferinList(beginDate: any, endDate: any, path: string, accept: boolean) {
    this.main.post('refer/list', { beginDate, endDate, path, accept }).then((rows: any) => {
      this.loading = false;
      if (rows.ok) {
        this.lists = rows.datas;
      }
    });
  }

  onDateRangeChanged(e) {
    this.loading = true;
    this.lists = [];
    this.beginDate = e.beginDate.year + '/' + e.beginDate.month + '/' + e.beginDate.day;
    this.endDate = e.endDate.year + '/' + e.endDate.month + '/' + e.endDate.day;
    this.getReferinList(this.beginDate, this.endDate, this.path, this.accept);
    this.getNonRead();
  }

  accepted(accept: boolean) {
    this.loading = true;
    this.accept = accept;
    this.getReferinList(this.beginDate, this.endDate, this.path, this.accept);
  }

}
