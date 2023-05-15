import { IUser } from "src/app/models/user.model";
import { UserService } from "../services/user/user.service";
import { HasSubscriptions } from "./subscription.component";

export class CurrentUser extends HasSubscriptions {

  private _onUserChangeCallback: (() => void) | undefined;
  protected _currentUser: IUser | null = null;

  constructor(userService: UserService) {
    super()
    this._currentUser = userService.user;
    this.addSubscription(
      userService.userChange.subscribe(this.userChange.bind(this))
    )
  }

  private userChange(user: IUser | null): void {
    this._currentUser = user;
    if (this._onUserChangeCallback) {
      this._onUserChangeCallback()
    }
  }

  public get currentUser(): IUser | null {
    return this._currentUser;
  }

  public onUserChange(callback: () => void): void {
    this._onUserChangeCallback = callback;
  }
}
