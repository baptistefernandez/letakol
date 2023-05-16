import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrentUser } from 'src/app/components/currentUser.component';
import { QueryCondition } from 'src/app/models/queryCondition.model';
import { IItem } from 'src/app/models/item.model';
import { IUser } from 'src/app/models/user.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserService } from 'src/app/services/user/user.service';
import { ECompare } from 'src/app/models/enums/firebase-compare.enum';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent extends CurrentUser {

  public user: IUser | undefined;
  public items: Array<IItem> = [];
  public displayItems: Array<IItem> = []; // handled by pagination

  constructor(activatedRoute: ActivatedRoute, firestoreService: FirestoreService) {
    super()

    this.addSubscription(
      activatedRoute.params.subscribe(params => {
        const userId = params['id']
        firestoreService.get<IUser>(userId).subscribe(user => {
          this.user = user;
          firestoreService.search([new QueryCondition('uid', ECompare.Equal, userId)]).subscribe(items => this.items = items)
        })
      })
    )
  }

}
