import { Component, OnInit } from '@angular/core';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private main: MainService
  ) { }

  ngOnInit() {
    document.body.className = 'hold-transition skin-green layout-top-nav fixed';
    this.main.socket.off('connect');
    this.main.socket.on('connect', () => {
      this.main.socket.emit('r9refer-username-online', this.main.decodeToken().username);
    });
  }

}
