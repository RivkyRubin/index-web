import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CategoryComponent } from './features/home/category/category.component';
import { MagazineComponent } from './features/magazine/magazine.component';
import { BsComponent } from './features/bs/bs.component';
import { BComponent } from './features/b/b.component';
import { SoonComponent } from './features/soon/soon.component';

export const routes: Routes = [
     { path: '', component: SoonComponent },
    { path: 'home', component: HomeComponent },
    { path: 'category/:id', component: CategoryComponent },
    { path: 'magazine', component: MagazineComponent },
    { path: 'bs', component: BsComponent },
    { path: 'b/:id', component: BComponent },


];
