declare module 'page-flip' {
    export class PageFlip {
      constructor(element: HTMLElement, options: any);
      loadFromImages(images: string[]): void;
      loadFromHTML(elements: NodeListOf<Element>): void;
      on(event: string, callback: (event: any) => void): void;
      flip(page: number): void;      
      flipNext(): void;
      flipPrev(): void;
      turnToPage(page:number): void;
    }
  }