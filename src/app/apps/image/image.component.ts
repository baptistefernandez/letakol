import { Component } from '@angular/core';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { EItemTypes } from 'src/app/models/enums/firebase-item-types.enum';
import { IImage } from 'src/app/models/image.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.less']
})
export class ImageComponent extends CurrentUser {

  public images: IImage[] = []
  public displayedImages: IImage[] = [];

  constructor(userService: UserService, firestoreService: FirestoreService) {
    super(userService)

    this.addSubscription(
      firestoreService.list<IImage>(EItemTypes.Image).subscribe(images => this.images = images)
    )
  }

}
