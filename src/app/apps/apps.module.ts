import { NgModule } from '@angular/core';
import { ImageComponent } from './image/image.component';
import { AppsComponent } from './apps.component';
import { RouterModule } from '@angular/router';
import { APPS_ROUTES } from './apps.routing';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    ImageComponent,
    AppsComponent,
  ],
  imports: [
    RouterModule.forChild(APPS_ROUTES),
    CommonModule,

  ]
})
export class AppsModule { }

export function loadAppsRouteModule() {
  return AppsModule;
}
