import { NgModule } from '@angular/core';
import { ImagesComponent } from './images/images.component';
import { AppsComponent } from './apps.component';
import { RouterModule } from '@angular/router';
import { APPS_ROUTES } from './apps.routing';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from '../components/components.module';
import { PixelsComponent } from './pixels/pixels.component';

@NgModule({
  declarations: [
    ImagesComponent,
    AppsComponent,
    PixelsComponent,
  ],
  imports: [
    RouterModule.forChild(APPS_ROUTES),
    CommonModule,
    ComponentsModule,
  ]
})
export class AppsModule { }

export function loadAppsRouteModule() {
  return AppsModule;
}
