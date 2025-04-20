import { JsonPipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { 
  Component, 
  ContentChildren, 
  QueryList, 
  TemplateRef, 
  ChangeDetectorRef,
  AfterContentInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener,
  input,
  effect,
  signal,
  computed,
  inject,
  Signal
} from '@angular/core';
import { PageFlip } from 'page-flip';
import { MagazineItem, MagazinePage } from '../../models/magazine-item.model';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
@Component({
  selector: 'app-flipbook',
  templateUrl: './flipbook.component.html',
  styleUrls: ['./flipbook.component.scss'],
  imports:[NgStyle,NgFor,NgIf,NgClass]
})



export class FlipbookComponent  implements AfterViewInit {
  @ViewChild('flipbookWrapper', { static: true }) flipbookWrapper!: ElementRef;
  @ViewChild('bookContainer', { static: true }) bookContainer!: ElementRef;
  @ViewChild('magazine', { static: true }) magazine!: ElementRef;

  readonly items = input<MagazineItem[]>();
  readonly imagesUrl = signal<string>(environment.imagesUrl);
  private router = inject(Router);
isZoom=signal<boolean>(false);
currentPage = signal<number>(-1);
  private pageFlip!: PageFlip;
  constructor(){
    effect(() => {
      if (this.items()&&this.items()!.length > 0) {
  // Delay execution to ensure *ngFor has rendered
  setTimeout(() => {
    const magazineWidth = this.magazine.nativeElement.offsetWidth;
    this.showFlipbook(magazineWidth);
  });      }
    });
  }
  ngAfterViewInit() {
   
    //this.showFlipbook(window.innerWidth-50);
  }

  pagesCount = computed(()=>this.pages().length);

  get stepsArray(): number[] {
    return Array.from({ length: (this.pagesCount()) / 2+1 }, (_, i) => this.pagesCount() - i * 2-1);
  }
  

  pages = computed(() => {
    const fullPages: MagazineItem[] = [];
    const halfWidthItems: MagazineItem[] = [];
    const halfHeightItems: MagazineItem[] = [];
    const quarterItems: MagazineItem[] = [];
    const arrangedPages: MagazinePage[] = [];
if(this.items())
{
    // Step 1: Categorize items
    for (const item of this.items()!) {
      switch (item.size) {
        case 'Full':
          fullPages.push(item);
          break;
        case 'HalfWidth':
          halfWidthItems.push(item);
          break;
        case 'HalfHeight':
          halfHeightItems.push(item);
          break;
        case 'Quarter':
          quarterItems.push(item);
          break;
      }
    }

    // Step 2: Form pages

    // Full pages
    for (const full of fullPages) {
      arrangedPages.push({ items: [full] });
    }

    // Pair HalfWidth items
    while (halfWidthItems.length >= 2) {
      arrangedPages.push({ items: [halfWidthItems.shift()!, halfWidthItems.shift()!] });
    }

    // Pair HalfHeight items
    while (halfHeightItems.length >= 2) {
      arrangedPages.push({ items: [halfHeightItems.shift()!, halfHeightItems.shift()!] });
    }

    // Group four Quarter items
    while (quarterItems.length >= 4) {
      arrangedPages.push({ items: [quarterItems.shift()!, quarterItems.shift()!, quarterItems.shift()!, quarterItems.shift()!] });
    }

    // Mix remaining quarters with HalfWidth/HalfHeight
    while (quarterItems.length >= 2 && halfWidthItems.length >= 1) {
      arrangedPages.push({ items: [halfWidthItems.shift()!, quarterItems.shift()!, quarterItems.shift()!] });
    }

    while (quarterItems.length >= 2 && halfHeightItems.length >= 1) {
      arrangedPages.push({ items: [halfHeightItems.shift()!, quarterItems.shift()!, quarterItems.shift()!] });
    }

    // Handle remaining items
    if (quarterItems.length > 0) {
      arrangedPages.push({ items: [...quarterItems] });
    }
    if (halfWidthItems.length > 0) {
      arrangedPages.push({ items: [...halfWidthItems] });
    }
    if (halfHeightItems.length > 0) {
      arrangedPages.push({ items: [...halfHeightItems] });
    }

  }
    return arrangedPages.reverse();
  });

  
  showFlipbook(width:number)
  {
    if(!this.isZoom())
      width=width/2;
    //width=Math.min(width*1.5,600*2);
 this.pageFlip = new PageFlip(this.flipbookWrapper.nativeElement, {
      width: width,
      height: width*1.5,
      startPage:this.pagesCount()+1,
      disableFlipByClick:true
    });
  
    // Convert children to an array
    const pages = Array.from(this.bookContainer.nativeElement.children) as HTMLElement[];
  
    // Remove bookContainer from DOM
    this.bookContainer.nativeElement.remove();
  
    // Create a document fragment and append pages to it
    const fragment = document.createDocumentFragment();
    pages.forEach(page => fragment.appendChild(page));
  
    // Now, load into PageFlip
    this.pageFlip.loadFromHTML(fragment.querySelectorAll('.my-page'));

    this.pageFlip.on('flip', (event) => {
      console.log('Flipped to page:', event.data);
      this.currentPage.set(event.data);
    });
    setTimeout(() => {
      this.stepTo(this.pagesCount()-1);
    }, 1000);
  }

  clicked()
  {
    alert("clicked");
  }
  next()
  {
    this.currentPage.update(page=>page+2);
    this.pageFlip.flipNext()
  }

  back()
  {    
    this.currentPage.update(page=>page-2);
    this.pageFlip.flipPrev()
  }

  stepTo(page:number)
  {
    this.pageFlip.flip(page);
    this.currentPage.set(page);
  }

  navigateToB(id:number)
  {
this.router.navigate(['/b',id]);
  }



  

  @HostListener('window:resize', ['$event'])
onResize(event:any) {
  //let width = event.target.innerWidth-300;
  //console.log("new width:",width);
  //this.showFlipbook(width);
  window.location.reload();
}

zoom()
{
this.isZoom.set(!this.isZoom());
setTimeout(() => {
  const width = this.isZoom() ? window.innerWidth - 50 : Math.min(window.innerWidth * 1.5, 600);
  this.showFlipbook(width);
}, 300);
}
  
}