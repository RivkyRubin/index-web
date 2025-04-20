import { Component, computed, inject, input, output, ResourceRef, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from '../../models/category.model';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-categories-list-ui',
  imports: [NgClass,NgIf],
  templateUrl: './categories-list-ui.component.html',
  styleUrl: './categories-list-ui.component.scss'
})
export class CategoriesListUiComponent {
  searchQuery = signal<string>('');
  private router = inject(Router);
  sharedService=inject(SharedService);
  onSelect = output<number>();
  onCloseSidebar=output();
  isMobile=signal<boolean>(false);
  readonly categories = input<Category[]>();
  readonly showSearch = input<boolean>(true);
readonly selectedCategoryId = input<number>(0);

  
constructor()
{
  this.isMobile=this.sharedService.isMobile;
}
  filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if(query==null || query=='')
      return this.categories()?.sort((a, b) => a.value.localeCompare(b.value)).filter(c=>c.id>0);
    return this.categories()?.filter(category =>
      category.id!=0&&(category.value.toLowerCase().includes(query)||category.name.toLowerCase().includes(query)||  category.details&&category.details.toLowerCase().includes(query))
    ).sort((a, b) => a.value.localeCompare(b.value));
  });

  
  navigateToCategory(id:number)
  {
    this.onSelect.emit(id);
this.router.navigate(['/category',id],{});
  }

  search(event:Event)
  {
    this.searchQuery.set((event.target as HTMLInputElement)?.value || '');
  }

  closeSidebar()
  {
    this.onCloseSidebar.emit();
  }
}