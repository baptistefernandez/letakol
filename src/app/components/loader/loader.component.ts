import { Component, Input, OnChanges } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnChanges {
  @Input() show: boolean = false;

  public hidding: boolean = false;
  public hidden: boolean = false;

  ngOnChanges(changes: { show?: boolean }): void {
    if (changes.hasOwnProperty('show') && changes.show) {
      setTimeout(() => {
        this.hidding = true;
        setTimeout(() => {
          this.hidden = true;
        }, environment.transitionTimeout);
      }, environment.transitionTimeout);
    }
  }
  
}
