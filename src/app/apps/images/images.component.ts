import { Component } from '@angular/core';
import { HasSubscriptions } from 'src/app/components/subscription.component';
import { EItemTypes } from 'src/app/models/enums/firebase-item-types.enum';
import { IImage } from 'src/app/models/image.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.less']
})
export class ImagesComponent extends HasSubscriptions {

  public images: IImage[] = []
  public displayedImages: IImage[] = [];

  constructor(firestoreService: FirestoreService) {
    super()

    this.addSubscription(
      firestoreService.list<IImage>(EItemTypes.Image).subscribe(images => this.images = images)
    )
  }

}
