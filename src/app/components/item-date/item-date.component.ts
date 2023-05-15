import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Utils } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-item-date',
  templateUrl: './item-date.component.html',
  styleUrls: ['./item-date.component.css']
})
export class ItemDateComponent implements OnChanges {

  @Input() date: number | undefined;

  public creationDate: string | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.date) {
      this.creationDate = Utils.timestampToLocaleDate(this.date);
    }
  }
}
