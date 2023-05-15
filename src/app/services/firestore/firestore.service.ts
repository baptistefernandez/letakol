import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { doc, query, where, collection, addDoc, updateDoc, deleteDoc, limitToLast, orderBy, DocumentReference, DocumentData, setDoc } from 'firebase/firestore';
import { Observable, from } from 'rxjs';
import { QueryCondition } from 'src/app/models/queryCondition.model';
import { ECompare } from 'src/app/models/enums/firebase-compare.enum';
import { EItemTypes } from 'src/app/models/enums/firebase-item-types.enum';
import { IItem } from 'src/app/models/item.model';
import { Utils } from '../utils/utils.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class FirestoreService {
	readonly TABLE = 'blob';
	readonly DEFAULT_LIMIT = 100;
	readonly DEFAULT_ORDER = 'lastUpdateDate'

	constructor(private readonly _firestore: Firestore) { }

	public create<T>(item: IItem): Promise<void> {
		const collectionReference = collection(this._firestore, this.TABLE)
		const { ...plainObject } = item;
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return setDoc(documentReference, plainObject)
	}

	public get<T>(id: string): Observable<T | undefined> {
		const documentReference = doc(this._firestore, `${this.TABLE}/${id}`);
		return docData(documentReference) as Observable<T>;
	}

	public list<T>(type: EItemTypes): Observable<T[]> {
		const collectionReference = collection(this._firestore, this.TABLE)
		const condition = where('type', ECompare.Equal, type)
		const documentData = query(collectionReference, condition)
		return collectionData(documentData) as Observable<T[]>;
	}

	public all(limit: number = this.DEFAULT_LIMIT, order: string = this.DEFAULT_ORDER): Observable<IItem[]> {
		const collectionReference = collection(this._firestore, this.TABLE)
		const documentData = query(collectionReference, orderBy(order, 'asc'), limitToLast(limit));
		return collectionData(documentData) as Observable<IItem[]>;
	}

	public search(conditions: QueryCondition[]): Observable<IItem[]> {
		const collectionReference = collection(this._firestore, this.TABLE)
		const wheres = conditions.map(condition => condition.toWhere())
		const documentData = query(collectionReference, ...wheres)
		Logger.log(`requesting collection`, conditions)
		return collectionData(documentData) as Observable<IItem[]>;
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
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return updateDoc(documentReference, { ...item });
	}

	public delete(item: IItem): Promise<void> {
		const documentReference = doc(this._firestore, `${this.TABLE}/${item.id}`);
		return deleteDoc(documentReference);
	}

}
