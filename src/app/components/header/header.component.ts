import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { UserService } from 'src/app/services/user/user.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent extends CurrentUser {

  constructor(private _userService: UserService, private _modalService: NgbModal) {
    super(_userService);
  }

  public logout(): void {
    this._userService.signOut();
  }

  public openLoginModal(): void {
    this._modalService.open(LoginModalComponent);
  }

}
