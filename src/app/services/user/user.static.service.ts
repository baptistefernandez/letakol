import { EventEmitter } from "@angular/core";
import { IUser } from "src/app/models/user.model";

export class UserStaticService {

  private static _user: IUser | null = null;
  private static _userList: IUser[] = [];

  public static userChange: EventEmitter<IUser | null> = new EventEmitter()

  public static set currentUser(user: IUser | null) {
    this._user = user;
    this.userChange.emit(user);
  }

  public static get currentUser(): IUser | null {
    return this._user;
  }

  public static get currentUid(): string | null {
    return this._user?.uid || null;
  }

  public static getUser(id: string): IUser | undefined {
    return this._userList.find(user => user.id === id);
  }

  public static addUser(user: IUser): void {
    if (this._userList.findIndex(u => u.id === user.id) < 0) {
      this._userList.push(user);
    }
  }
}
