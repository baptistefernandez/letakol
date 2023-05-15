import { EItemTypes } from './enums/firebase-item-types.enum';
import { EmptyItem, IItem } from './item.model';

export interface IUserData {
  uid: string;
  displayName: string;
  email: string;
  isAnonymous: boolean;
  photoURL: string;
  admin: boolean;
}

export interface IUser extends IItem {
  data: IUserData;
}

export class User extends EmptyItem implements IUser {
  constructor(name: string, data: IUserData) {
    super(EItemTypes.User, name, data)
  }
}