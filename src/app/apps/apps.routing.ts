import { Routes } from '@angular/router';
import { AppsComponent } from './apps.component';
import { ImageComponent } from './image/image.component';

export const APPS_ROUTES: Routes = [
    {
        path: 'apps', component: AppsComponent,
        children: [
            { path: 'image', component: ImageComponent },
        ]
    },
];
