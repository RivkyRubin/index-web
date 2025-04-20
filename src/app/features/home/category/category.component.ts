import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { DataService } from '../../../services/data/data.service';
import { NgIf } from '@angular/common';
import { BPostComponent } from '../../../shared/ui/b-post/b-post.component';
import { CategoriesListUiComponent } from '../../../shared/ui/categories-list-ui/categories-list-ui.component';
import { Category } from '../../../shared/models/category.model';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-category',
  imports: [NgIf,BPostComponent,CategoriesListUiComponent],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
})
export class CategoryComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  searchQuery = signal<string>('');
categoryId=signal<number>(0);
 defaultCategory: Category = {
  id: 0,
  name: 'Default Category',
  value:'כל העסקים'
  // Add other necessary properties with default values
};

  ngOnInit()
{
   this.route.paramMap.subscribe((params: ParamMap) => {
        let categoryId = params.get('id');
          this.categoryId.set(Number(categoryId));
          this.updateSEO();

      });

}
  // Signal for category ID from route params
  //categoryId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  category = computed(
    () =>
      this.dataService.categories().find((c) => c.id === this.categoryId()) ||
      this.defaultCategory
  );

  categories = computed(
    () =>
      this.dataService.categories()
  );

  bs = computed(() => {
    const categoryId = this.categoryId();
    const items = this.dataService.bs().filter(b=>b.hideBusiness!=true);
  
    return categoryId === 0 ? items : items.filter(c => c.hideBusiness!=true && c.categories&&c.categories.indexOf( categoryId)>-1);
  });
  
  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    let items = this.bs();
  
    // Sort items so that those with hasImage === true appear first
    items = items.sort((a, b) => Number(b.hasImage) - Number(a.hasImage));
  
    if (!query) return items;
  
    return items.filter(b => 
      b.value.toLowerCase().includes(query) || 
      b.name.toLowerCase().includes(query)||
      b.slogan&&b.slogan.toLowerCase().includes(query)
    );
  });

  itemsWithEmail = computed(() => {
    let items = this.bs();
  
    // Sort items so that those with hasImage === true appear first
    items = items.sort((a, b) => Number(b.hasImage) - Number(a.hasImage)).filter(a=>a.email!=undefined&&a.email!='');
  return items;
   
  });
  

  search(event:Event)
  {
    this.searchQuery.set((event.target as HTMLInputElement)?.value || '');
  }


  //for seo
  private updateSEO(): void {
    const currentCategory = this.category();
    
    // Create SEO title based on category
    const title = currentCategory.id === 0 
      ? 'כל העסקים | רמה ד אונליין' 
      : `${currentCategory.value} | רמה ד אונליין`;
    
    // Set page title
    this.titleService.setTitle(title);
    
    // Create meta description
    const description = currentCategory.id === 0
      ? `כל העסקים ברמה ד`
      : `רשימת עסקים בקטגוריית ${currentCategory.value}`;
    
    // Update meta tags
    this.metaService.updateTag({ name: 'description', content: description });
    
    // Add Open Graph tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: `https://rama-d.co.il/category/${currentCategory.id}` });
    
    // Add Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    
    // Set canonical URL to prevent duplicate content issues
    this.updateCanonicalLink(`https://rama-d.co.il/category/${currentCategory.id}`);
    
    // Add structured data for better search results
    this.addStructuredData();
  }
  
  private updateCanonicalLink(url: string): void {
    let linkElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    
    linkElement.setAttribute('href', url);
  }
  
  private addStructuredData(): void {
    const currentCategory = this.category();
    const businesses = this.bs();
    
    // Create schema for category page
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': currentCategory.id === 0 ? 'כל העסקים' : currentCategory.value,
      'description': `רשימת עסקים בקטגוריית ${currentCategory.value}`,
      'url': `https://rama-d.co.il/category/${currentCategory.id}`,
      'mainEntity': {
        '@type': 'ItemList',
        'numberOfItems': businesses.length,
        'itemListElement': businesses.slice(0, 10).map((business, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'LocalBusiness',
            'name': business.name,
            'url': `https://rama-d.co.il/business/${business.id}`
          }
        }))
      }
    };

    // Remove existing structured data if any
    const existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add new structured data
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}
