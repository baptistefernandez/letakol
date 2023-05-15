import { Component, Input } from '@angular/core';
import { IItem } from 'src/app/models/item.model';
import { Router } from '@angular/router';

@Component({
	selector: 'app-item',
	templateUrl: './item.component.html',
	styleUrls: ['./item.component.css'],
})
export class ItemComponent {
	@Input() item: IItem | undefined;

	constructor(private _router: Router) { }

	public click(item: IItem): void {
		this._router.navigate(['/', item.type, item.id]);
	}
}
