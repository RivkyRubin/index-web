import { Component, resource, signal } from '@angular/core';
import { NgStyle } from '@angular/common';
import { GalleryItemComponent } from '../../shared/ui/gallery-item/gallery-item.component';
import { BPostComponent } from '../../shared/ui/b-post/b-post.component';
import { BPost } from '../../shared/models/b-post.model';
import { GalleryItem } from '../../shared/models/gallery-item.model';
import { Category } from '../../shared/models/category.model';
import { CategoriesBoxComponent } from '../../shared/ui/categories-box/categories-box.component';
import { FlipbookComponent } from '../../shared/ui/flipbook/flipbook.component';
import { environment } from '../../../environments/environment';
import { CategoriesListUiComponent } from '../../shared/ui/categories-list-ui/categories-list-ui.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [BPostComponent,CategoriesBoxComponent,NgStyle,CategoriesListUiComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
query = signal<string>("");

categories = resource<Category[], string>({
  request: () => this.query(),
  loader: async ({ request, abortSignal }) => {
    //const response = await fetch(`${API_URL}/search?q=${request}`, {
    const response = await fetch(environment.filesUrl+`data/categories.json`, {
        signal: abortSignal,
    });

    if (!response.ok) throw new Error("שגיאה בטעינת קטגוריות!");
    const data: Category[] = await response.json();

    // Filter categories where isShowInHomePage is true
    return data.filter(category => category.usedCategory === true);
  },
});

bs = resource<BPost[], string>({
  request: () => this.query(),
  loader: async ({ request, abortSignal }) => {
    const response = await fetch(environment.filesUrl + `data/bs.json`, {
      signal: abortSignal,
    });

    if (!response.ok) throw new Error("שגיאה בטעינת עסקים!");

    const data = await response.json();

    // Filter items where showInHomePage is true
    return data.filter((item: BPost) => item.showInHomePage);
  },
});

navigateToB()
{
  window.open('https://b.rama-d.co.il', '_blank');

}

search(event: Event) {
  const { value } = event.target as HTMLInputElement;
  this.query.set(value);
}
}






