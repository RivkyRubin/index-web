import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CategoryComponent } from './features/home/category/category.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'category/:id', component: CategoryComponent }

];
