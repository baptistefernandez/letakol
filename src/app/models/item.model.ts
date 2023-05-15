import { UserService } from '../services/user/user.service';
import { UserStaticService } from '../services/user/user.static-service';
import { Utils } from '../services/utils/utils.service';
import { EItemTypes } from './enums/firebase-item-types.enum';

export interface IItem {
	id: string;				// doc ref id
	uid: string;			// user id
	name: string;
	type: EItemTypes;
	data: any;
	creationDate: number;
	lastUpdateDate: number;
	public: boolean;		// visible to all or only to the user
}

export class EmptyItem implements IItem {
	public public: boolean = true
	public id: string;
	public uid: string;
	public creationDate: number;
	public lastUpdateDate: number;

	constructor(
		public type: EItemTypes,
		public name: string,
		public data: any
	) {
		const date = Date.now();
		this.id = Utils.generateId()
		this.uid = UserStaticService.user!.id
		this.creationDate = date;
		this.lastUpdateDate = date;
	}
}