import { NgFor, NgIf } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-full-screen-image',  
  templateUrl: './full-screen-image.component.html',
  styleUrls: ['./full-screen-image.component.scss'],

  imports:[NgIf,NgFor],

})
export class FullScreenImageComponent {
  // Sample image data
  // images = signal( [
  //   { 
  //     url: 'https://picsum.photos/id/1018/800/600', 
  //     alt: 'Random Image 1' 
  //   },
  //   { 
  //     url: 'https://picsum.photos/id/1015/800/600', 
  //     alt: 'Random Image 2' 
  //   },
  //   { 
  //     url: 'https://picsum.photos/id/1019/800/600', 
  //     alt: 'Random Image 3' 
  //   }
  // ]);

    readonly imageSrc = input<string>();
  
    images = computed(()=>[{
      url:this.imageSrc()||'',
      alt: ''
    }]);

  // Currently displayed full screen image
  fullScreenImage: { url: string, alt: string } | null = null;
  
  // Index of current full screen image
  currentImageIndex: number = 0;

  // Open full screen view
  openFullScreen(image: { url: string, alt: string }) {
    this.fullScreenImage = image;
    this.currentImageIndex = this.images().findIndex(img => img.url === image.url);
  }

  // Close full screen view
  closeFullScreen() {
    this.fullScreenImage = null;
  }

  // Navigate to previous image
  navigatePrevious(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    this.fullScreenImage = this.images()[this.currentImageIndex];
  }

  // Navigate to next image
  navigateNext(event: Event) {
    event.stopPropagation();
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    this.fullScreenImage = this.images()[this.currentImageIndex];
  }
}