import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss']
})
export class Tab4Component implements OnInit {
  @Input() tab4?: any;
  constructor() { }

  ngOnInit() {
  }

}
