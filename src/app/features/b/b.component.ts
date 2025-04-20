import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService } from '../../services/data/data.service';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { environment } from '../../../environments/environment';
import { GoogleTagManagerService } from 'angular-google-tag-manager';
import { SharedService } from '../../services/shared.service';
import { FullScreenImageComponent } from '../../shared/full-screen-image/full-screen-image.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-b',
  imports: [
    NgStyle,
    NgIf,
    NgFor,
    RouterLink,
    NgClass,
    FullScreenImageComponent,
  ],
  templateUrl: './b.component.html',
  styleUrl: './b.component.scss',
})
export class BComponent {
  private route = inject(ActivatedRoute);
  private dataService = inject(DataService);
  private gtmService = inject(GoogleTagManagerService);
  private sharedService = inject(SharedService);
  private titleService = inject(Title);
  private metaService = inject(Meta);
  
  readonly imagesUrl = signal<string>(environment.imagesUrl);
  phoneNumber = signal<string>('');
  
  // Signal for category ID from route params
  bId = computed(() => Number(this.route.snapshot.paramMap.get('id')));

  b = computed(
    () => this.dataService.bs().find((c) => c.id === this.bId()) || null
  );

  magazineItem = computed(
    () =>
      this.dataService.magazineItems().find((c) => c.bId === this.bId()) || null
  );

  constructor() {
    effect(() => {
      const id = this.bId();
      if (id) {
        this.gtmService.pushTag({
          event: 'viewBusinessDetails',
          itemId: id,
          pagePath: this.route.snapshot.url.join('/') || 'unknown',
        });
        
        // Update SEO information when business ID changes
        this.updateSEO();
      }
    });
  }

  // Update SEO metadata for the business
  private updateSEO(): void {
    const business = this.b();
    if (!business) return;
    
    // Get business name and location
    const name = business.value || '';
    
    // Create SEO title with business name and location
    let title = name;

    title += ' | רמה ד אונליין';
    
    // Set page title
    this.titleService.setTitle(title);
    
    // Create meta description
    let description = business.slogan || '';
    if (!description && business.description) {
      // Take first 150 characters of description if slogan is not available
      description = business.description.substring(0, 150);
      if (business.description.length > 150) {
        description += '...';
      }
    }
    
    if (!description) {
      // Fallback description with business name and location
      description = `${name} ${location ? '- ' + location : ''}. Find business details, contact information and more.`;
    }
    
    // Update meta tags
    this.metaService.updateTag({ name: 'description', content: description });
    
    // Add keywords meta tag for business name, category and location
    const categories = business.categories ? 
      this.dataService.categories()
        .filter(c => business.categories?.includes(c.id))
        .map(c => c.value)
        .join(', ') : 
      '';
        
    const keywords = `${name}, ${categories}${location ? ', ' + location : ''}`;
    this.metaService.updateTag({ name: 'keywords', content: keywords });
    
    // Add Open Graph tags for social sharing
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'business.business' });
    
    const url = `https://rama-d.co.il/b/${business.id}`;
    this.metaService.updateTag({ property: 'og:url', content: url });
    
    // Add image if available
    const imageUrl = this.sharedService.getLogo(business,true);
    if (imageUrl) {
      this.metaService.updateTag({ property: 'og:image', content: imageUrl });
    }
    
    // Add Twitter Card tags
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    if (imageUrl) {
      this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
    }
    
    // Set canonical URL to prevent duplicate content issues
    this.updateCanonicalLink(url);
    
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
    const business = this.b();
    if (!business) return;
    
    // Create Schema.org LocalBusiness structured data
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': business.value,
      'url': `https://rama-d.co.il/b/${business.id}`
    };
    
    // Add business details if available
    if (business.slogan) {
      schema.description = business.slogan;
    }
    
    if (business.phone) {
      schema.telephone = business.phone;
    }
    
    if (business.email) {
      schema.email = business.email;
    }
    
    // Add address information
    const addressParts = [];
    if (business.address) addressParts.push(business.address);
    
    if (addressParts.length > 0) {
      schema.address = {
        '@type': 'PostalAddress',
        'addressLocality':  'רמה ד בית שמש',
        'streetAddress': business.address || '',
        'addressCountry': 'IL' // Assuming Israel as default country
      };
    }
    
   // Add image if available
     const imageUrl = this.sharedService.getImage(business,true);
    if (imageUrl) {
      schema.image = imageUrl;
    }
    
    // Add logo if available
    const logoUrl = this.sharedService.getLogo(business,true);
    if (logoUrl) {
      schema.logo = logoUrl;
    }
    
    // Add categories as business types
    if (business.categories && business.categories.length > 0) {
      const categoryNames = this.dataService.categories()
        .filter(c => business.categories?.includes(c.id))
        .map(c => c.value);
        
      if (categoryNames.length > 0) {
        schema.additionalType = categoryNames;
      }
    }
    
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

  get getLogo(): string {
    if (this.b()) return this.sharedService.getLogo(this.b()!);
    return '';
  }

  get getBigImage(): string {
    if (this.b()) return this.sharedService.getBigImage(this.b()!);
    return '';
  }

  get getImage(): string {
    if (this.b()) return this.sharedService.getImage(this.b()!);
    return '';
  }

  showPhoneNumber() {
    let phoneText = '';
    if (this.b()?.phone) {
      phoneText = this.b()?.phone!;
      this.phoneNumber.set(this.b()?.phone!);
      if (this.b()?.phone2) {
        phoneText = `${phoneText} | ${this.b()?.phone2!}`;
      }
      this.phoneNumber.set(phoneText);
    }
  }
}