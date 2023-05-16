import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { doc, query, where, collection, addDoc, updateDoc, deleteDoc, limitToLast, orderBy, DocumentReference, DocumentData, setDoc, Query, QueryConstraint } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { EqualCondition, QueryCondition } from 'src/app/models/queryCondition.model';
import { ECompare } from 'src/app/models/enums/firebase-compare.enum';
import { EItemTypes } from 'src/app/models/enums/firebase-item-types.enum';
import { IItem } from 'src/app/models/item.model';
import { Utils } from '../utils/utils.service';
import { Logger } from '../logger/logger.service';
import { UserStaticService } from '../user/user.static.service';
import { UserError } from 'src/app/models/error/user-error.error';

@Injectable()
export class FirestoreService {
	readonly TABLE = 'blob';
	readonly DEFAULT_LIMIT = 100;
	readonly DEFAULT_ORDER = 'lastUpdateDate'

	constructor(private readonly _firestore: Firestore) { }

	private userGuard(): boolean {
		return UserStaticService.currentUser ? true : false
	}

	private collection<T>(constraints: QueryConstraint[] = []): Observable<T[]> {
		const collectionReference = collection(this._firestore, this.TABLE)
		const documentData = query(collectionReference, ...constraints);
		Logger.log(`[FirestoreService] requesting collection`, constraints)
		return collectionData(documentData) as Observable<T[]>
	}

	public create(item: IItem): Promise<void> {
		if (!this.userGuard()) { return Promise.reject(new UserError) }
		// transform Item onto Object (JSON)
		const { ...plainObject } = item;
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return setDoc(documentReference, plainObject)
	}

	public get<T>(id: string): Observable<T | undefined> {
		const documentReference = doc(this._firestore, `${this.TABLE}/${id}`);
		return docData(documentReference) as Observable<T>;
	}

	public list<T>(type: EItemTypes): Observable<T[]> {
		const constraints = where(`type`, ECompare.Equal, type)
		return this.collection<T>([constraints])
	}

	public all(limit: number = this.DEFAULT_LIMIT, order: string = this.DEFAULT_ORDER): Observable<IItem[]> {
		const contraints = [orderBy(order, 'asc'), limitToLast(limit)]
		return this.collection<IItem>(contraints);
	}

	public search(conditions: QueryCondition[]): Observable<IItem[]> {
		const contraints = conditions.map(condition => condition.toWhere())
		return this.collection<IItem>(contraints)
	}

	public searchOne(conditions: QueryCondition[]): Observable<IItem> {
		return new Observable(observer => {
			this.search(conditions).subscribe(items => {
				const uniqueItem = items.length > 1 ? undefined : Utils.first(items) || undefined
				observer.next(uniqueItem)
				observer.complete()
			})
		})
	}


	public update(item: IItem): Promise<void> {
		if (!this.userGuard()) { return Promise.reject(new UserError) }
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return updateDoc(documentReference, { ...item });
	}

	public delete(item: IItem): Promise<void> {
		if (!this.userGuard()) { return Promise.reject(new UserError) }
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return deleteDoc(documentReference);
	}

}
