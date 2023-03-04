import { Component } from '@angular/core';

import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  readonly env = JSON.stringify(environment(), null, 2);

  constructor() {
    console.log(this.env);
  }
}
