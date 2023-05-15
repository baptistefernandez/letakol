import { IUser } from "src/app/models/user.model";

export class UserStaticService {

  private static _user: IUser | null = null;

  public static set user(user: IUser | null) {
    this._user = user;
  }

  public static get user(): IUser | null {
    return this._user || null;
  }

  public static get uid(): string | null {
    return this._user?.uid || null
  }
}
