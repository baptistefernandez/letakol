import { Component } from '@angular/core';
import { Debouncer } from 'src/app/classes/debouncer.class';
import { EPixelColors } from 'src/app/models/enums/pixel-war-colors.enum';
import { IItem } from 'src/app/models/item.model';
import { IPixel, Pixel } from 'src/app/models/pixel.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { environment } from 'src/environments/environment';
import { Observable, interval, of } from 'rxjs';
import { mergeMap, delay, map, take, tap, filter } from 'rxjs/operators';

@Component({
	selector: 'app-default',
	templateUrl: './default.component.html',
	styleUrls: ['./default.component.css'],
})
export class DefaultComponent {
	public items: Array<IItem> = [];
	public displayedItems: Array<IItem> = [];
	public searchDebouncer: Debouncer;

	constructor(private _firestoreService: FirestoreService) {
		this.searchDebouncer = new Debouncer(this.search.bind(this), environment.debouncerTimeout);
		this._firestoreService.all(8).subscribe(result => {
			this.items = result
			this.displayedItems = this.items;
		})
	}

	public search(string: string): void {
		const pixel: IPixel = new Pixel({
			color: EPixelColors.Black,
			posX: 5,
			posY: 9
		})
		console.log(pixel)
		this._firestoreService.create(pixel).then(value => {
			console.log(value)
		}, reason => {
			console.warn(reason)
		})
		this.displayedItems = this.items.filter((item) => item.name.includes(string) || item.type.includes(string));
	}
}
