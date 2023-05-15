import { EventEmitter, Injectable, inject } from "@angular/core";
import { FirestoreService } from "../firestore/firestore.service";
import { UserStaticService } from "./user.static-service";
import { IUser, IUserData } from "src/app/models/user.model";
import { Observable } from 'rxjs'
import { EqualCondition } from "src/app/models/queryCondition.model";
import { Auth, authState, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable()
export class UserService {
	public userChange = new EventEmitter<IUser | null>();
	private _userList: Array<IUser> = [];
	private _auth: Auth = inject(Auth);

	constructor(private _firestoreService: FirestoreService) {
		authState(this._auth).subscribe(authUser => {
			if (authUser) {
				this._firestoreService.searchOne([
					new EqualCondition(`type`, 'user'),
					new EqualCondition(`data.uid`, authUser.uid)
				]).subscribe(user => this.updateUser(user))
			}
		})
	}

	public get user(): IUser | null {
		return UserStaticService.user;
	}

	public getUser(userId: string): Observable<IUser | undefined> {
		const user = this._userList.find(user => user.id === userId);
		const oUser = new Observable<IUser>(observer => {
			if (user) {
				observer.next(user);
			} else {
				this._firestoreService.get<IUser>(userId).subscribe(user => {
					if (user) {
						this._userList.push(user)
						observer.next(user)
					}
				})
			}
		})
		return oUser
	}

	public isLoggedIn(): boolean {
		return UserStaticService.user !== null;
	}

	private searchUser(email: string) {
		return this._firestoreService.searchOne([
			new EqualCondition(`type`, 'user'),
			new EqualCondition(`name`, email)
		])
	}

	private newUser(user: IUserData): Promise<void> {
		// create and save new user in firestore
		return Promise.resolve()
	}

	private updateUser(user: IUser | null): void {
		UserStaticService.user = user;
		this.userChange.emit(user);
	}

	public register({ email, password }: { email: string, password: string }): Promise<void> {
		this.searchUser(email).subscribe(user => {
			console.log('register user found:', user)
		})
		// verifier que l'utilisateur n'existe pas deja
		// creer l'utilisater via Auth
		// ajouter l'utilisateur creé en base fire
		// si l'enregistrement en base echoue, on supprime le firebase-auth créé
		return Promise.resolve()
	}

	public signIn({ email, password }: { email: string, password: string }): Promise<void> {
		return new Promise((resolve, reject) => {
			this.searchUser(email).subscribe(user => {
				if (user) {
					signInWithEmailAndPassword(this._auth, email, password).then(credentials => {
						this.updateUser(user)
						resolve()
					}, error => reject(error))
				} else {
					reject(new Error(`User ${email} not found`))
				}
			})
		})
	}

	public signInWithGoogle(): Promise<void> {
		return Promise.resolve()
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

	public updateProfile(profile: { displayName: string, photoURL: string }): Promise<void> {
		return Promise.resolve()
	}
}
