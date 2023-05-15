import { Component } from '@angular/core';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent extends CurrentUser {

  constructor(userService: UserService) {
    super(userService)
  }

}
