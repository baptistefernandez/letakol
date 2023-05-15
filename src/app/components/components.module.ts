import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { HeaderComponent } from './header/header.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { InputFormComponent } from './input-form/input-form.component';
import { ItemDateComponent } from './item-date/item-date.component';
import { ItemComponent } from './item/item.component';
import { LoaderComponent } from './loader/loader.component';
import { MutexButtonComponent } from './mutex-button/mutex-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { UserLinkComponent } from './user-link/user-link.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    LoginModalComponent,
    InputFormComponent,
    LoaderComponent,
    UserLinkComponent,
    MutexButtonComponent,
    PaginationComponent,
    ConfirmModalComponent,
    ItemDateComponent,
    ItemComponent,
    AvatarComponent,
  ],
  exports: [
    HeaderComponent,
    LoginModalComponent,
    InputFormComponent,
    LoaderComponent,
    UserLinkComponent,
    MutexButtonComponent,
    PaginationComponent,
    ConfirmModalComponent,
    ItemDateComponent,
    ItemComponent,
    AvatarComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ComponentsModule { }
