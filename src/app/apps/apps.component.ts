import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from '../services/utils/utils.service';

class App {
  public path: Array<string>;
  constructor(readonly a: string, readonly name: string, readonly description: string = '') {
    this.path = ['/', 'apps', a];
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
    new App('image', 'Gallery')
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
