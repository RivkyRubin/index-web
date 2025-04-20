import {
  Component,
  computed,
  signal,
  inject,
  resource,
  effect,
  HostListener,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MagazineItem } from '../../shared/models/magazine-item.model';
import { DataService } from '../../services/data/data.service';
import { environment } from '../../../environments/environment';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';
import { Router } from '@angular/router';
import { FlipbookComponent } from '../../shared/ui/flipbook/flipbook.component';
import { ScrollToTopDirective } from '../../shared/directives/scroll-to-top.directive';
import { FullScreenImageComponent } from "../../shared/full-screen-image/full-screen-image.component";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  imports: [
    ScrollToTopDirective,
    FullScreenImageComponent,
    NgFor,
    InfiniteScrollDirective,
    NgClass,
    NgIf,
    FlipbookComponent,
    FullScreenImageComponent
],
})
export class BoardComponent {
  dataService = inject(DataService);
  router = inject(Router);
  isGallery = signal<boolean>(true);
  isDesktopWidth = signal<boolean>(window.innerWidth > 1200);
  isPortrait = signal<boolean>(window.innerHeight > window.innerWidth);

  readonly imagesUrl = signal<string>(environment.imagesUrl);
  loadedCount = signal(10);
  loadCount=signal(10);
  // Detect screen width
  isMobile = signal(window.innerWidth < 768);
  screenWidth = signal(window.innerWidth);
  constructor() {
    
    window.addEventListener('resize', () => {
      this.isMobile.set(window.innerWidth < 768);
      this.screenWidth.set(window.innerWidth);
      this.isDesktopWidth.set(window.innerWidth > 1200);

    });

    effect(() => {
      if (this.items.value()) {
        this.allItems.set(this.items.value()!);
        this.displayedItems.set(this.allItems().slice(0, this.loadedCount()));
      }
    });
  }

  ngAfterViewInit()
  {
    if(!this.isDesktopWidth())
    {
    }
  
  }

  @HostListener('window:orientationchange', ['$event'])
  onOrientationChange(event: Event): void {
    this.isPortrait.set(window.innerHeight > window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isPortrait.set(window.innerHeight > window.innerWidth);
  }

 
  allItems = signal<MagazineItem[]>([]); // Store all items
  displayedItems = signal<MagazineItem[]>([]); // Items currently displayed

  // Fetch dataset only once
  items = resource<MagazineItem[], string>({
    loader: async ({ abortSignal }) => {
      const response = await fetch(`data/magazine-items.json`, {
        signal: abortSignal,
      });
      if (!response.ok) throw new Error('שגיאה בטעינת קטגוריות!');
      const data: MagazineItem[] = await response.json();
      return data.map((item) => ({
        ...item,
        b: this.dataService.getBById(item.bId!)(),
      }));
    },
  });

  // Compute columns based on screen size
  columns = computed(() => {
    const cols: MagazineItem[][] = this.isMobile() ? [[]] : [[], [], []];

    this.displayedItems().forEach((item, index) => {
      cols[index % cols.length].push(item);
    });

    return cols;
  });

  // Append items instead of replacing them
  loadMore() {
    const nextItems = this.allItems().slice(
      this.displayedItems().length,
      this.displayedItems().length + this.loadCount()
    );
    if (nextItems.length > 0) {
      this.displayedItems.set([...this.displayedItems(), ...nextItems]);
    }
  }

  navigateToB(id: number) {
    this.router.navigate(['/b', id]);
  }
}
