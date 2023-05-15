import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {

  @Input() title: string = 'Confirmation modal';
  @Input() content: string = '';
  @Input() alert: string = '';
  @Input() btnClass: string = 'btn-outline-danger';
  @Input() lock: boolean = false;

  @Output() confirm = new EventEmitter();

  constructor(private _modalService: NgbModal) { }

  public closeModal(): void {
    this._modalService.dismissAll();
  }

  public onConfirm(): void {
    this.confirm.emit();
  }

}
