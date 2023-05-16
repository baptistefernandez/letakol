import { IUser } from "src/app/models/user.model";
import { UserService } from "../services/user/user.service";
import { HasSubscriptions } from "./subscription.component";
import { UserStaticService } from "../services/user/user.static.service";

type UserChangeCallback = (user: IUser | null) => void

export class CurrentUser extends HasSubscriptions {

  private _onUserChangeCallback: UserChangeCallback | undefined;
  protected _currentUser: IUser | null = null;

  constructor() {
    super()
    this._currentUser = UserStaticService.currentUser;
    this.addSubscription(
      UserStaticService.userChange.subscribe(this.userChange.bind(this))
    )
  }

  private userChange(user: IUser | null): void {
    this._currentUser = user;
    if (this._onUserChangeCallback) {
      this._onUserChangeCallback(user)
    }
  }

  public get currentUser(): IUser | null {
    return this._currentUser;
  }

  public onUserChange(callback: UserChangeCallback): void {
    this._onUserChangeCallback = callback;
  }
}
