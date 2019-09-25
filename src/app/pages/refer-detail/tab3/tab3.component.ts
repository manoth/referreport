import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.component.html',
  styleUrls: ['./tab3.component.scss']
})
export class Tab3Component implements OnInit {
  @Input() tab3?: any;
  constructor() { }

  ngOnInit() {
  }

}
