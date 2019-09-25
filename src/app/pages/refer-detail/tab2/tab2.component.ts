import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.component.html',
  styleUrls: ['./tab2.component.scss']
})
export class Tab2Component implements OnInit {
  @Input() tab2?: any;
  constructor() { }

  ngOnInit() {
  }

}
