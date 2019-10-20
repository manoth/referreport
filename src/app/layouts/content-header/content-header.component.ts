import { Component, OnInit, Input } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-content-header',
  templateUrl: './content-header.component.html',
  styleUrls: ['./content-header.component.scss']
})
export class ContentHeaderComponent implements OnInit {

  header: any;
  user: any;

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
    this.main.dataHeader.subscribe((data: any) => {
      this.header = data;
    });
    this.user = this.main.decodeToken();
    this.main.getDcodedToken.subscribe((data: any) => {
      this.user = data;
    });
  }

}
