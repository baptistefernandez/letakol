import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FirestoreService } from 'src/app/services/firestore/firestore.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { FIREBASE_CONFIG } from 'src/environments/firebase.token';
import { DefaultComponent } from './views/default/default.component';
import { AdminComponent } from './views/admin/admin.component';
import { UserService } from './services/user/user.service';
import { ComponentsModule } from './components/components.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserComponent } from './views/user/user.component';
import { AppsModule } from './apps/apps.module';
import { ROUTES } from './app-routing';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { UserEditComponent } from './views/user/edit/edit.component';

@NgModule({
  declarations: [
    AppComponent,
    DefaultComponent,
    AdminComponent,
    UserComponent,
    UserEditComponent,
  ],
  imports: [
    RouterModule.forRoot(ROUTES),
    BrowserModule,
    ComponentsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppsModule,
    provideFirebaseApp(() => initializeApp(FIREBASE_CONFIG)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [
    FirestoreService,
    UserService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
