import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../services/utils/utils.service';

class App {
  readonly path: Array<string>;
  constructor(readonly route: string, readonly name: string, readonly description: string = '') {
    this.path = ['/', 'apps', route];
  }
}

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.less']
})
export class AppsComponent {

  public currentApp: string | undefined;

  public apps: Array<App> = [
    new App('images', 'Gallery'),
    new App('pixels', 'Pixels war')
  ]

  constructor(private _router: Router, activatedRoute: ActivatedRoute) {
    activatedRoute.url.subscribe(url => {
      const routeSnapshot = Utils.first(activatedRoute.snapshot.children)
      this.currentApp = routeSnapshot?.routeConfig?.path
    })
  }

  public click(app: App): void {
    this._router.navigate(app.path);
  }
}
