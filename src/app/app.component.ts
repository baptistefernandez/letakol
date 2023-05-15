import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  public loaded: boolean = false;
  public display: boolean = false;

  ngOnInit(): void {
    this.loaded = true;
  }

  public loaderCb(): void {
    this.display = true;
  }

}
