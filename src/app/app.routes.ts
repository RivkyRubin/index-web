import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CategoryComponent } from './features/home/category/category.component';
import { MagazineComponent } from './features/magazine/magazine.component';
import { BsComponent } from './features/bs/bs.component';
import { BComponent } from './features/b/b.component';
import { SoonComponent } from './features/soon/soon.component';
import { CategoryPageComponent } from './features/category-page/category-page.component';
import { BoardComponent } from './features/board/board.component';
import { NadlanComponent } from './features/nadlan/nadlan.component';
import { AboutComponent } from '../about/about.component';

export const routes: Routes = [
     { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    // { path: 'category/:id', component: CategoryComponent },
    { 
        path: 'category', 
        component: CategoryPageComponent, 
        children: [ { 
          path: '', pathMatch: 'full', redirectTo: '0' }, 
          { path: ':id', component: CategoryComponent } 
        ] 
      },
    { path: 'magazine', component: MagazineComponent },
    { path: 'bs', component: BsComponent },
    { path: 'board', component: BoardComponent },
    { path: 'about', component: AboutComponent },
    { path: 'nadlan', component: NadlanComponent },
    { path: 'b/:id', component: BComponent },


];
