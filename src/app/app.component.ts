import { Component } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'referreport';

  constructor() {
    $('body').addClass('bg-blue30');
  }
}
