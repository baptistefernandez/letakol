import { Routes } from '@angular/router';
import { DefaultComponent } from './views/default/default.component';
import { AdminComponent } from './views/admin/admin.component';
import { UserComponent } from './views/user/user.component';
import { loadAppsRouteModule } from './apps/apps.module';
import { UserEditComponent } from './views/user/edit/edit.component';

export const ROUTES: Routes = [
  { path: '', component: DefaultComponent },

  { path: 'admin', component: AdminComponent },
  { path: 'user/edit', component: UserEditComponent },
  { path: 'user/:id', component: UserComponent },

  { path: 'apps', loadChildren: loadAppsRouteModule },

  { path: '**', redirectTo: '' },
];
