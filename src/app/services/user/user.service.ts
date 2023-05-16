import { EventEmitter, Injectable, inject } from "@angular/core";
import { FirestoreService } from "../firestore/firestore.service";
import { UserStaticService } from "./user.static.service";
import { IUser, IUserData } from "src/app/models/user.model";
import { Observable } from 'rxjs'
import { EqualCondition } from "src/app/models/queryCondition.model";
import { Auth, signInWithPopup, GoogleAuthProvider, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { ILoginInfo } from "src/app/models/login.model";
import { EmptyItem } from "src/app/models/item.model";
import { EItemTypes } from "src/app/models/enums/firebase-item-types.enum";

@Injectable()
export class UserService {
	private _auth: Auth = inject(Auth);

	public userChange = new EventEmitter<IUser | null>();
	public readonly userLoaded: EventEmitter<void> = new EventEmitter();

	constructor(private _firestoreService: FirestoreService) {
		authState(this._auth).subscribe(authUser => {
			if (authUser) {
				this.getUserFromUid(authUser.uid).subscribe(user => {
					this.updateUser(user || null)
					this.userLoaded.emit()
				})
			} else {
				this.userLoaded.emit()
			}
		})
	}

	public get user(): IUser | null {
		return UserStaticService.currentUser;
	}

	private updateUser(user: IUser | null): void {
		UserStaticService.currentUser = user;
		this.userChange.emit(user);
	}

	public getUserFromId(userId: string): Observable<IUser | undefined> {
		const user = UserStaticService.getUser(userId);
		const oUser = new Observable<IUser>(observer => {
			if (user) {
				observer.next(user);
				observer.complete();
			} else {
				this._firestoreService.get<IUser>(userId).subscribe(user => {
					if (user) {
						UserStaticService.addUser(user)
						observer.next(user);
						observer.complete();
					}
				})
			}
		})
		return oUser
	}

	public isLoggedIn(): boolean {
		return UserStaticService.currentUser !== null;
	}

	private getUserFromEmail(email: string): Observable<IUser> {
		return this._firestoreService.searchOne([
			new EqualCondition(`type`, 'user'),
			new EqualCondition(`name`, email)
		])
	}

	private getUserFromUid(uid: string): Observable<IUser> {
		return this._firestoreService.searchOne([
			new EqualCondition(`type`, 'user'),
			new EqualCondition(`data.uid`, uid)
		])
	}

	private newUser({ user }: UserCredential): Promise<void> {
		const userData: IUserData = {
			uid: user.uid,
			displayName: user.displayName!,
			email: user.email!,
			isAnonymous: false,
			photoURL: "",
			admin: false
		}
		const newUser = new EmptyItem(EItemTypes.User, user.email!, userData)
		return this._firestoreService.create(newUser)
	}

	public register({ email, password }: ILoginInfo): Promise<void> {
		return new Promise((resolve, reject) =>
			this.getUserFromEmail(email).subscribe(user => {
				if (!user) {
					createUserWithEmailAndPassword(this._auth, email, password).then(
						credentials => this.newUser(credentials).then(
							() => resolve(),
							error => new Error(error)
						),
						error => new Error(error))
				} else {
					reject(new Error(`User ${email} already exists`))
				}
			})
		)
	}

	public signIn({ email, password }: ILoginInfo): Promise<void> {
		return new Promise((resolve, reject) =>
			this.getUserFromEmail(email).subscribe(user => {
				if (user) {
					signInWithEmailAndPassword(this._auth, email, password)
						.then(credentials => resolve(), error => reject(error))
				} else {
					reject(new Error(`User ${email} not found`))
				}
			})
		)
	}

	public signInWithGoogle(): Promise<void> {
		const provider = new GoogleAuthProvider
		return signInWithPopup(this._auth, provider).then()
	}

	public signOut(): Promise<void> {
		return new Promise((resolve, reject) =>
			signOut(this._auth).then(
				() => {
					this.updateUser(null)
					resolve()
				}).catch((error) => reject(error))
		)
	}

	public updateProfile(userInfo: { displayName: string, photoURL: string }): Promise<void> {
		const user = UserStaticService.currentUser!;
		user.data.displayName = userInfo.displayName;
		user.data.photoURL = userInfo.photoURL;
		return this._firestoreService.update(user);
	}
}
