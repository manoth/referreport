import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xray',
  templateUrl: './xray.component.html',
  styleUrls: ['./xray.component.scss']
})
export class XrayComponent implements OnInit {
  @Input() xray?: any;
  constructor() { }

  ngOnInit() {
  }

}
