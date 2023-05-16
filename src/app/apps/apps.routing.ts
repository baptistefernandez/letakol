import { Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { ImagesComponent } from './images/images.component';
import { PixelsComponent } from './pixels/pixels.component';

export const APPS_ROUTES: Routes = [
    {
        path: 'apps', component: AppsComponent,
        children: [
            { path: 'images', component: ImagesComponent },
            { path: 'pixels', component: PixelsComponent },
        ]
    },
];
