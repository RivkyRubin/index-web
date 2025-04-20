import { 
  Directive, 
  ElementRef, 
  HostListener, 
  Input, 
  Renderer2, 
  OnInit, 
  OnDestroy 
} from '@angular/core';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true
})
export class ScrollToTopDirective implements OnInit, OnDestroy {
  // How far the element needs to be scrolled before showing the button
  @Input() threshold: number = 200;

  // Custom class for the scroll-to-top button
  @Input() buttonClass: string = 'scroll-to-top-btn';

  private scrollButton: HTMLButtonElement | null = null;

  constructor(
    private el: ElementRef, 
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.createScrollButton();
  }

  ngOnDestroy() {
    if (this.scrollButton) {
      this.renderer.removeChild(document.body, this.scrollButton);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event: Event) {
    // debugger;
    const scrollTop = (event.target as HTMLElement).scrollTop;
    this.toggleScrollButton(scrollTop);
  }

  private createScrollButton() {
    this.scrollButton = this.renderer.createElement('button');
    
    // Add classes
    this.renderer.addClass(this.scrollButton, this.buttonClass);
    this.renderer.addClass(this.scrollButton, 'hidden');

    // Set button content (you can customize this)
    this.scrollButton!.innerHTML = '↑';

    // Add click event to scroll to top
    this.renderer.listen(this.scrollButton, 'click', () => {
      this.el.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Add to body
    this.renderer.appendChild(document.body, this.scrollButton);
  }

  private toggleScrollButton(scrollTop: number) {
    if (!this.scrollButton) return;

    if (scrollTop > this.threshold) {
      this.renderer.removeClass(this.scrollButton, 'hidden');
    } else {
      this.renderer.addClass(this.scrollButton, 'hidden');
    }
  }
}