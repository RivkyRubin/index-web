import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, RouterOutlet } from '@angular/router';
import { CategoriesListUiComponent } from '../../shared/ui/categories-list-ui/categories-list-ui.component';
import { DataService } from '../../services/data/data.service';
import { Category } from '../../shared/models/category.model';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { ScrollToTopDirective } from '../../shared/directives/scroll-to-top.directive';

@Component({
  selector: 'app-category-page',
  imports: [NgClass,CategoriesListUiComponent,NgIf,RouterOutlet,ScrollToTopDirective],
  templateUrl: './category-page.component.html',
  styleUrl: './category-page.component.scss'
})
export class CategoryPageComponent implements OnInit {
  dataService=inject(DataService);
  route = inject(ActivatedRoute);
  sharedService=inject(SharedService);
  router=inject(Router);
  openSideBar=signal<boolean>(false);
  isMobile=signal<boolean>(false);
id=signal<number>(0);
defaultCategory: Category = {
  id: 0,
  name: 'All',
  value:'כל העסקים'
  // Add other necessary properties with default values
};
constructor()
{
  this.isMobile=this.sharedService.isMobile;
}
  ngOnInit() {
    this.route.firstChild?.paramMap.subscribe((params: ParamMap) => {
      let categoryId = params.get('id');
      if (categoryId) {
        this.id.set(Number(categoryId));
      }
    });
  }




    categories = computed(
      () =>
        this.dataService.categories()
    );

    category = computed(
      () =>
        this.categories().find(x=>x.id==this.id())||
      this.defaultCategory

    );

    onSelect(categoryId:number)
    {
this.openSideBar.set(false);
    }

    onCloseSidebar()
    {
      this.openSideBar.set(false);
    }

    navigateToAllCategories()
    {
          this.router.navigate(['/category'],{});

    }

}