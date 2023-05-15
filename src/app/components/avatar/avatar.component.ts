import { Component, Input } from '@angular/core';
import { IUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.less']
})
export class AvatarComponent {

  @Input() user: IUser | undefined

}
