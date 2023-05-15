import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Mutex } from 'src/app/classes/mutex.class';
import { UserService } from 'src/app/services/user/user.service';
import { CurrentUser } from '../currentUser.component';

type LoginInfo = Partial<{ email: string | null; password: string | null; }>

@Component({
	selector: 'app-login-modal',
	templateUrl: './login-modal.component.html',
	styleUrls: ['./login-modal.component.css'],
})
export class LoginModalComponent extends CurrentUser {
	public loginForm = new FormGroup({
		email: new FormControl('', Validators.required),
		password: new FormControl('', Validators.required),
	});
	public mutex = new Mutex(false);

	constructor(private _userService: UserService, private _modalService: NgbModal) {
		super(_userService)
		this.onUserChange(user => {
			if (user) {
				this._modalService.dismissAll();
			}
		})
	}

	public register(form: LoginInfo): void {
		this.mutex.exec(this._userService.register.bind(this._userService), form);
	}

	public login(form: LoginInfo): void {
		this.mutex.exec(this._userService.signIn.bind(this._userService), form);
	}

	public googleLogin(): void {
		this._userService.signInWithGoogle(); // no mutex because popup
	}

	public close(): void {
		this._modalService.dismissAll();
	}
}
