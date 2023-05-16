import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IUser } from 'src/app/models/user.model';
import { Mutex } from 'src/app/classes/mutex.class';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { UserStaticService } from 'src/app/services/user/user.static.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class UserEditComponent extends CurrentUser {
  public mutex = new Mutex();
  public userForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    photoURL: new FormControl(),
  });

  constructor(private _userService: UserService, router: Router) {
    super();

    this.onUserChange(user => {
      if (!user) {
        router.navigate(['/']);
        return;
      }
      this.setUser(user)
    })
    this.setUser(UserStaticService.currentUser)
  }

  private setUser(user: IUser | null): void {
    if (user) {
      this.userForm.setValue({
        displayName: user.data.displayName,
        photoURL: user.data.photoURL,
      });
    }
  }

  public update(form: Partial<{ displayName: string | null, photoUrl: string | null }>): void {
    this.mutex.exec(this._userService.updateProfile.bind(this._userService), form);
  }
}
