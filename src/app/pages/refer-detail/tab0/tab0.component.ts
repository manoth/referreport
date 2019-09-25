import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab0',
  templateUrl: './tab0.component.html',
  styleUrls: ['./tab0.component.scss']
})
export class Tab0Component implements OnInit {
  @Input() detail?: any;
  constructor() { }

  ngOnInit() {
  }

}
