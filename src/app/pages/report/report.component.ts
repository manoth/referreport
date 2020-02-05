import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { CryptoService } from 'src/app/services/crypto.service';
import { ExcelService } from 'src/app/services/excel.service';

import { IMyDrpOptions } from 'mydaterangepicker';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  myDateRangePickerOptions: IMyDrpOptions;
  mydaterange: any;
  beginDate: any;
  endDate: any;

  provcode: string = '';

  loading: boolean = true;

  reportId: string;
  topic: any;
  report: any;
  textAlign: any;

  provAll: any;
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
  reverseKeyOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }
  valueOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return a.value.localeCompare(b.value);
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private main: MainService,
    private crypto: CryptoService,
    private excel: ExcelService
  ) {
    let d = new Date();
    d.setDate((d.getDate() + 1));
    let disableSince: any = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }
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
    let toDay = new Date();
    let beginDate: any = { year: toDay.getFullYear(), month: toDay.getMonth() + 1, day: 1 }
    let endDate: any = { year: toDay.getFullYear(), month: toDay.getMonth() + 1, day: toDay.getDate() }
    this.mydaterange = {
      beginDate: beginDate,
      endDate: endDate
    };
    this.beginDate = beginDate.year + '/' + beginDate.month + '/' + beginDate.day;
    this.endDate = endDate.year + '/' + endDate.month + '/' + endDate.day;
  }

  ngOnInit() {
    this.getProv();
    this.main.inputHeader({ path: '/report', name: 'รายงาน', icon: 'fa-bars' });
    this.route.params.subscribe((params) => {
      try {
        this.reportId = this.crypto.atou(params.id);
        this.getReport(this.reportId, this.beginDate, this.endDate, this.provcode);
      } catch (err) {
        this.router.navigate(['/']);
      }
    });
  }

  getProv() {
    this.main.get('report/prov').then((res: any) => {
      this.provAll = res.data;
    });
  }

  getReport(id: string, beginDate: any, endDate: any, provcode: string) {
    this.loading = true;
    let data = { beginDate, endDate, provcode }
    this.main.post('report/' + id, data).then((res: any) => {
      this.loading = false;
      this.topic = res.topic;
      this.report = res.data;
      this.main.inputHeader({
        path: '/report', name: 'รายงาน', subname: this.topic.report_name, icon: 'fa-bars', ifdname: true, dname: this.topic.report_name
      });
    });
  }

  onDateRangeChanged(e: any) {
    this.loading = true;
    this.beginDate = e.beginDate.year + '/' + e.beginDate.month + '/' + e.beginDate.day;
    this.endDate = e.endDate.year + '/' + e.endDate.month + '/' + e.endDate.day;
    this.getReport(this.reportId, this.beginDate, this.endDate, this.provcode);
  }

  onProv(provcode: string) {
    this.getReport(this.reportId, this.beginDate, this.endDate, provcode);
  }

  onToExcel() {
    this.excel.exportAsExcelFile(this.report, this.topic.report_name);
  }

}
