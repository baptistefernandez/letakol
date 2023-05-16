import { Component, OnDestroy } from '@angular/core';
import { Mutex } from 'src/app/classes/mutex.class';
import { CurrentUser } from '../../components/currentUser.component';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IItem } from 'src/app/models/item.model';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfirmModalComponent } from 'src/app/components/confirm-modal/confirm-modal.component';

enum ESortTypes {
	Uid,
	Name,
	Type,
	CreationDate,
	LastUpdate,
}

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.css'],
})
export class AdminComponent extends CurrentUser {
	private _deleteConfirmModal: NgbModalRef | undefined;

	public items: Array<IItem> = [];
	public displayedItems: Array<IItem> = [];
	public mutex = new Mutex();
	public sortTypes = ESortTypes;
	public sortBy: ESortTypes | null = ESortTypes.LastUpdate;
	public ascOrder = true;

	constructor(
		private _firestoreService: FirestoreService,
		private _router: Router,
		private _modalService: NgbModal
	) {
		super();

		this.checkAdmin();
		this.onUserChange(() => this.checkAdmin.bind(this))

		this.addSubscription(
			this._firestoreService.all().subscribe(items => {
				this.items = items;
				this.sort(this.sortBy, true);
			})
		)
	}

	private checkAdmin(): void {
		if (!this._currentUser || !this._currentUser.data.admin) {
			this._router.navigate(['/']);
		}
	}
	public sort(by: ESortTypes | null, force: boolean = false): void {
		const items = this.items.slice();
		if (!force) {
			by === this.sortBy ? (this.ascOrder = !this.ascOrder) : (this.sortBy = by);
		}
		switch (by) {
			case ESortTypes.Uid:
				// items.sort((a, b) => (a.type === EItemTypes.User ? a.id.localeCompare(b.id) : a.uid.localeCompare(b.uid)));
				items.sort((a, b) => (this.ascOrder ? a.uid.localeCompare(b.uid) : b.uid.localeCompare(a.uid)));
				break;
			case ESortTypes.Name:
				items.sort((a, b) => (this.ascOrder ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));
				break;
			case ESortTypes.Type:
				items.sort((a, b) => (this.ascOrder ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type)));
				break;
			case ESortTypes.CreationDate:
				items.sort((a, b) => (this.ascOrder ? b.creationDate - a.creationDate : a.creationDate - b.creationDate));
				break;
			case ESortTypes.LastUpdate:
				items.sort((a, b) => (this.ascOrder ? b.lastUpdateDate - a.lastUpdateDate : a.creationDate - b.creationDate));
				break;
			default:
		}
		this.items = items;
	}

	public goTo(item: IItem): void {
		this._router.navigate(['/', item.type, item.id]);
	}

	public delete(item: IItem): void {
		this._deleteConfirmModal = this._modalService.open(ConfirmModalComponent);
		this._deleteConfirmModal.componentInstance.content = `Are you sure you want to delete this ${item.type} ?`;
		this._deleteConfirmModal.componentInstance.lock = false;
		this._deleteConfirmModal.componentInstance.confirm.subscribe(() => this.confirmDelete(item));
	}

	private confirmDelete(item: IItem): void {
		console.log(item) // TODO
		if (this._deleteConfirmModal) {
			this._deleteConfirmModal.componentInstance.lock = true;
			this.mutex.exec(this._firestoreService.delete.bind(this._firestoreService), item).finally(() => {
				if (this._deleteConfirmModal) {
					this._deleteConfirmModal.componentInstance.lock = false;
					this._deleteConfirmModal.close();
				}
			})
		}
	}
}
