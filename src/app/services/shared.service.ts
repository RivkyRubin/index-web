import { Injectable, signal } from '@angular/core';
import { BPost } from '../shared/models/b-post.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  readonly imagesUrl = signal<string>(environment.imagesUrl);

  isMobile = signal(window.innerWidth < 768);
  constructor() {
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
    }); 
  }

  get getIsMobile(){
    return this.isMobile;
  }
  getLogo(b: BPost,useAbsolute: boolean = false): string {
    if (b.hasLogo) {
      return this.imagesUrl() + b.name + '/logo.png';
    }
    let path;
    let categories = b.categories;
    if (categories && categories.length) {
      path= 'icons/categories/' + b.categories![0] + '.svg';
    }
    else path= 'icons/categories/1.svg';
    if(useAbsolute)
    {
path = this.makeAbsoluteUrl(path);
    }
    return path;
  }

  getImage(b: BPost,useAbsolute: boolean = false): string {
    if (b.hasImage) {
      return this.imagesUrl() + b.name + '/image.jpg';
    }
    let categories = b.categories;
    let path;
    if (categories && categories.length) {
      path= 'icons/categories/' + b.categories![0] + '.svg';
    }
    else path= 'icons/categories/1.svg';
    if(useAbsolute)
      {
  path = this.makeAbsoluteUrl(path);
      }
      return path;
  }

  getBigImage(b: BPost): string {
    if (b.hasBigImage) {
      return this.imagesUrl() + b.name + '/big.jpg';
    }
    let categories = b.categories;
    if (categories && categories.length) {
      return 'icons/categories/' + b.categories![0] + '.svg';
    }
    return 'icons/categories/1.svg';
  }
  
  
  private makeAbsoluteUrl(url: string): string {
        return `${origin}/${url.replace(/^\//, '')}`;
  }
}
