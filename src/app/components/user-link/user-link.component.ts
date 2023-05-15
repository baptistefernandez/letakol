import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { IUser } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
	selector: 'app-user-link',
	templateUrl: './user-link.component.html',
	styleUrls: ['./user-link.component.css'],
})
export class UserLinkComponent implements OnChanges {
	@Input() user: IUser | undefined;
	@Input() userId: string | undefined;
	@Input() light: boolean = true;

	constructor(private _userService: UserService, private _router: Router) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (this.userId) {
			this._userService.getUserFromId(this.userId).subscribe(user => this.user = user)
		}
	}

	public get displayName() {
		return this.user ? this.user.data.displayName || this.user.name : null;
	}

	public click(): void {
		if (this.user) {
			this._router.navigate(['/', 'user', this.user.id]);
		}
	}
}
